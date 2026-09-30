#!/usr/bin/env python3
"""
Bundle builder for UniPulse
Combines all ESM modules into a single zero-dependency standalone script
so UniPulse can run smoothly both over local HTTP servers and direct file:// scheme in browsers.
"""

import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def build_bundle():
    # Ordered list of modules so dependencies precede consumers
    files = [
        "js/theme.js",
        "js/data.js",
        "js/auth.js",
        "js/components/toasts.js",
        "js/components/modals.js",
        "js/components/sidebar.js",
        "js/components/header.js",
        "js/views/dashboard.js",
        "js/views/assistant.js",
        "js/views/campusMap.js",
        "js/views/lostFound.js",
        "js/views/spaces.js",
        "js/views/events.js",
        "js/views/profile.js",
        "js/views/admin.js",
        "js/views/login.js",
        "js/app.js"
    ]

    bundle_lines = [
        "/**",
        " * UniPulse Standalone Production Bundle",
        " * Designed for zero-dependency execution across HTTP and direct file:// preview.",
        " */",
        "(function() {",
        "  'use strict';",
        ""
    ]

    for rel_path in files:
        full_path = os.path.join(BASE_DIR, rel_path)
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Strip module syntax (handles multi-line imports and `export async function`)
        content = re.sub(r'^[ \t]*import\s[^;]*?from\s*[\'"][^\'"]*[\'"];?[ \t]*$', '', content, flags=re.M)
        content = re.sub(r'^([ \t]*)export\s+default\s+', r'\1', content, flags=re.M)
        content = re.sub(r'^([ \t]*)export\s+(async\s+)?(const|let|var|function|class)\s+', r'\1\2\3 ', content, flags=re.M)
        content = re.sub(r'^[ \t]*export\s*\{[^}]*\};?[ \t]*$', '', content, flags=re.M)

        leftover = re.search(r'^[ \t]*(import|export)\s', content, flags=re.M)
        if leftover:
            raise SystemExit(f"Unsupported module syntax left in {rel_path}: {leftover.group(0).strip()}")

        bundle_lines.append(f"  // --- Source: {rel_path} ---")
        for line in content.splitlines():
            bundle_lines.append("  " + line)
        bundle_lines.append("")

    bundle_lines.append("})();")

    bundle_path = os.path.join(BASE_DIR, "js", "bundle.js")
    with open(bundle_path, "w", encoding="utf-8") as f:
        f.write("\n".join(bundle_lines))

    print(f"Successfully generated standalone bundle at: {bundle_path} ({os.path.getsize(bundle_path)} bytes)")

if __name__ == "__main__":
    build_bundle()
