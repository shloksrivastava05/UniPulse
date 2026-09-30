/**
 * UniPulse Theme Manager
 * Handles Light / Dark / System appearance preference, persistence,
 * live OS-theme change detection, and the toggle UI's icon/label helpers.
 */

const THEME_STORAGE_KEY = "unipulse-theme";
let systemChangeHandlerBound = false;

export function getThemePreference() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch (e) {
    /* localStorage unavailable (private browsing, etc.) — fall back below */
  }
  return "dark";
}

function systemPrefersDark() {
  return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

function resolveIsDark(preference) {
  if (preference === "dark") return true;
  if (preference === "light") return false;
  return systemPrefersDark();
}

function applyTheme(preference) {
  const isDark = resolveIsDark(preference);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.setAttribute("data-theme-preference", preference);
}

export function setThemePreference(preference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch (e) {
    /* ignore write failures */
  }
  applyTheme(preference);
}

export function isDarkActive() {
  return resolveIsDark(getThemePreference());
}

export function initTheme() {
  applyTheme(getThemePreference());

  if (window.matchMedia && !systemChangeHandlerBound) {
    systemChangeHandlerBound = true;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (getThemePreference() === "system") {
        applyTheme("system");
      }
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
    } else if (mq.addListener) {
      // Safari < 14 fallback
      mq.addListener(handler);
    }
  }
}

// Small inline icon set for the toggle button/dropdown (currentColor-based, theme-safe)
const THEME_ICONS = {
  light: `<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.364 6.364l-1.06-1.06M6.696 6.696L5.636 5.636m12.728 0l-1.06 1.06M6.696 17.304l-1.06 1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"/></svg>`,
  dark: `<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
  system: `<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`
};

export function getThemeToggleIconMarkup(preference) {
  return THEME_ICONS[preference] || THEME_ICONS.system;
}

export const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" }
];
