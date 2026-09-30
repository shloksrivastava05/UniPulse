#!/usr/bin/env python3
"""
UniPulse Local Development Server
Provides clean static file serving with correct MIME types for modern ES modules,
CSS, images, and fonts.
"""

import http.server
import socketserver
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class UniPulseHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def guess_type(self, path):
        if path.endswith('.js') or path.endswith('.mjs'):
            return 'application/javascript'
        if path.endswith('.css'):
            return 'text/css'
        if path.endswith('.svg'):
            return 'image/svg+xml'
        if path.endswith('.json'):
            return 'application/json'
        return super().guess_type(path)

def run_server(port=PORT):
    handler = UniPulseHTTPRequestHandler
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"=====================================================")
            print(f"  UniPulse Campus Platform is running live at:")
            print(f"  http://localhost:{port}")
            print(f"  Serving files from: {DIRECTORY}")
            print(f"=====================================================")
            httpd.serve_forever()
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"Port {port} in use, trying port {port + 1}...")
            run_server(port + 1)
        else:
            raise e

if __name__ == '__main__':
    port = PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run_server(port)
