/**
 * UniPulse Main Application Orchestrator
 * Client-side router, state management, modal & keyboard bindings,
 * and dynamic view rendering.
 */

import { renderSidebar, renderMobileNav, setSidebarGroupOpen } from "./components/sidebar.js";
import { renderHeader } from "./components/header.js";
import { modals } from "./components/modals.js";
import { toasts } from "./components/toasts.js";
import { lostAndFoundItems } from "./data.js";
import { initTheme, setThemePreference } from "./theme.js";

// View Renderers & Initializers
import { renderDashboard, initDashboardListeners } from "./views/dashboard.js";
import { renderAssistant, initAssistantListeners } from "./views/assistant.js";
import { renderCampusMap, initCampusMapListeners } from "./views/campusMap.js";
import { renderLostFound, initLostFoundListeners } from "./views/lostFound.js";
import { renderSpaces, initSpacesListeners } from "./views/spaces.js";
import { renderEvents, initEventsListeners } from "./views/events.js";
import { renderProfile, initProfileListeners } from "./views/profile.js";
import { renderAdmin, initAdminListeners } from "./views/admin.js";
import { auth } from "./auth.js";
import { renderLogin, initLogin } from "./views/login.js";

const APP_MENU_PAIRS = [
  ["theme-toggle-btn", "theme-toggle-dropdown"],
  ["notifications-btn", "notifications-dropdown"],
  ["sidebar-profile-trigger", "sidebar-profile-menu"],
  ["header-avatar-btn", "header-profile-menu"]
];

class UniPulseApp {
  constructor() {
    this.currentRoute = "dashboard";
    this.isAdminMode = false;
    this.routeParams = {};
    this.activeCleanup = null;
    this.sidebarCollapsed = false;
  }

  init() {
    if (!auth.session()) { this.showLogin(); return; }
    this.start();
  }

  showLogin() {
    document.getElementById("app-root").innerHTML = renderLogin();
    initLogin(() => {
      window.location.hash = "";
      this.currentRoute = auth.isAdmin() ? "admin" : "dashboard";
      this.isAdminMode = auth.isAdmin();
      this.start();
    });
  }

  start() {
    // Read route from URL hash if present
    const hash = window.location.hash.replace("#", "").trim();
    if (hash) {
      if (hash === "admin" && auth.isAdmin()) {
        this.isAdminMode = true;
        this.currentRoute = "admin";
      } else {
        this.currentRoute = hash === "admin" ? "dashboard" : hash;
      }
    }

    this.bindGlobalShortcuts();
    this.render();

    // Listen to hash changes
    window.addEventListener("hashchange", () => {
      // Always dismiss any stuck-open modal on ANY hash change — including
      // navigating back to Home, where the hash clears to an empty string
      // entirely. That empty-hash case used to fall through this handler
      // untouched, so a modal left open never got told to close.
      modals.close();

      const newHash = window.location.hash.replace("#", "").trim() || "dashboard";
      if (newHash !== this.currentRoute) {
        this.navigate(newHash);
      }
    });

    // Initial welcoming sound/chime trigger on first user click
    window.addEventListener("click", () => {
      // Warm up audio context
    }, { once: true });
  }

  navigate(route, params = {}) {
    // Always dismiss any open modal on route change. The modal overlay lives
    // outside #app-root (appended directly to <body>), so it survives a
    // route re-render untouched — if it was left open (e.g. the user hit
    // the browser Back button instead of clicking Close), its blurred
    // backdrop would otherwise stay stuck on screen over the new page.
    modals.close();

    // Role guard: only admin accounts may open the admin console.
    if (route === "admin" && !auth.isAdmin()) {
      route = "dashboard";
      params = { ...params, isAdminMode: false };
    }

    if (this.activeCleanup && typeof this.activeCleanup === "function") {
      this.activeCleanup();
      this.activeCleanup = null;
    }

    if (params.isAdminMode !== undefined) {
      this.isAdminMode = params.isAdminMode;
    } else if (route === "admin") {
      this.isAdminMode = true;
    } else {
      this.isAdminMode = false;
    }

    this.currentRoute = route;
    this.routeParams = params;
    window.location.hash = route;
    this.render();
  }

  bindGlobalShortcuts() {
    // One-time listeners for every dropdown: outside click, Esc, arrow keys
    document.addEventListener("click", (e) => {
      if (!e.target.closest('[role="menu"], #theme-toggle-dropdown, #notifications-dropdown')) this.closeMenus();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { this.closeMenus(); return; }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const open = document.querySelector('[role="menu"]:not(.hidden)');
      if (!open) return;
      e.preventDefault();
      const items = Array.from(open.querySelectorAll(".up-menu-item"));
      const i = items.indexOf(document.activeElement);
      const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i <= 0 ? items.length - 1 : i - 1);
      items[next].focus();
    });

    // Cmd+K or Ctrl+K shortcut
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.openGlobalSearch();
      }
    });
  }

  openGlobalSearch() {
    modals.openCommandPalette((selection) => {
      if (selection.target) {
        if (selection.target === "campusMap" && selection.building) {
          this.navigate("campusMap", { selectedBuildingId: selection.building });
        } else if (selection.target === "assistant") {
          this.navigate("assistant", { initialQuery: "I have 40 minutes free. Where can I study quietly?" });
        } else {
          this.navigate(selection.target);
        }
      }
    });
  }

  render() {
    const root = document.getElementById("app-root");
    if (!root) return;

    // Outer Shell Layout: Left Sidebar + (Header + Main View) + Mobile Nav
    root.innerHTML = `
      <div class="flex min-h-screen up-page text-slate-900 font-sans">
        <!-- Desktop Sidebar (Hidden on Mobile) -->
        <div class="hidden md:block">
          ${renderSidebar(this.currentRoute, this.isAdminMode, this.sidebarCollapsed)}
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-w-0 up-content">
          ${renderHeader(this.currentRoute)}

          <!-- Dynamic View Container -->
          <main id="main-view-container" class="flex-1 overflow-x-hidden">
            ${this.getViewHtml()}
          </main>
        </div>

        <!-- Mobile Bottom Navigation Bar -->
        ${renderMobileNav(this.currentRoute)}
      </div>
    `;

    syncLayoutVars();
    this.attachGlobalShellListeners();
    this.initCurrentView();
  }

  getViewHtml() {
    switch (this.currentRoute) {
      case "dashboard":
        return renderDashboard();
      case "assistant":
        return renderAssistant(this.routeParams.initialQuery || "");
      case "campusMap":
        return renderCampusMap(this.routeParams.selectedBuildingId || "bld-34");
      case "lostFound":
        return renderLostFound();
      case "spaces":
        return renderSpaces();
      case "events":
        return renderEvents();
      case "profile":
        return renderProfile();
      case "admin":
        return renderAdmin();
      default:
        return renderDashboard();
    }
  }

  initCurrentView() {
    switch (this.currentRoute) {
      case "dashboard":
        this.activeCleanup = initDashboardListeners((route, params) => this.navigate(route, params));
        break;
      case "assistant":
        initAssistantListeners((route, params) => this.navigate(route, params), this.routeParams.initialQuery || "");
        break;
      case "campusMap":
        initCampusMapListeners(this.routeParams.selectedBuildingId || "bld-34");
        break;
      case "lostFound":
        initLostFoundListeners();
        break;
      case "spaces":
        initSpacesListeners((route, params) => this.navigate(route, params));
        break;
      case "events":
        initEventsListeners();
        break;
      case "profile":
        initProfileListeners();
        break;
      case "admin":
        initAdminListeners((route, params) => this.navigate(route, params));
        break;
    }
  }

  closeMenus(exceptMenuId = null) {
    APP_MENU_PAIRS.forEach(([triggerId, menuId]) => {
      if (menuId === exceptMenuId) return;
      const menu = document.getElementById(menuId);
      const trigger = document.getElementById(triggerId);
      if (menu) menu.classList.add("hidden");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  bindMenu(triggerId, menuId) {
    const trigger = document.getElementById(triggerId);
    const menu = document.getElementById(menuId);
    if (!trigger || !menu) return;
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = menu.classList.contains("hidden");
      this.closeMenus(willOpen ? menuId : null);
      menu.classList.toggle("hidden", !willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
      const first = menu.querySelector(".up-menu-item");
      if (willOpen && first && e.detail === 0) first.focus();
    });
    if (trigger.tagName !== "BUTTON") {
      trigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); trigger.click(); }
      });
    }
  }

  bindAccountMenu(triggerId, menuId) {
    this.bindMenu(triggerId, menuId);
    const menu = document.getElementById(menuId);
    if (!menu) return;
    menu.querySelectorAll("[data-menu-route]").forEach(item => {
      item.addEventListener("click", () => this.navigate(item.dataset.menuRoute));
    });
    const logout = menu.querySelector("[data-menu-logout]");
    if (logout) {
      logout.addEventListener("click", () => {
        this.closeMenus();
        auth.logout();
        window.location.hash = "";
        window.location.reload();
      });
    }
  }

  attachGlobalShellListeners() {
    // Sidebar collapse toggle
    const collapseBtn = document.getElementById("sidebar-collapse-btn");
    if (collapseBtn) {
      collapseBtn.addEventListener("click", () => {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        this.render();
      });
    }

    // Brand Logo Click -> Dashboard
    const brandLogo = document.getElementById("brand-logo-btn");
    if (brandLogo) {
      brandLogo.addEventListener("click", () => this.navigate("dashboard", { isAdminMode: false }));
    }

    // Sidebar Navigation Buttons
    document.querySelectorAll(".nav-link-btn, .mobile-nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const route = btn.dataset.route;
        if (route) {
          this.navigate(route);
        }
      });
    });

    // Toggle Role Mode Switcher (Student <-> Admin)
    const toggleRoleBtn = document.getElementById("toggle-role-mode-btn");
    if (toggleRoleBtn) {
      toggleRoleBtn.addEventListener("click", () => {
        if (this.isAdminMode) {
          this.navigate("dashboard", { isAdminMode: false });
          toasts.show({
            title: "Student View Active",
            message: "Switched to standard student profile.",
            type: "info"
          });
        } else {
          this.navigate("admin", { isAdminMode: true });
          toasts.show({
            title: "Admin Console Active",
            message: "Access granted for Campus Operations & Facilities auditing.",
            type: "success"
          });
        }
      });
    }

    // Account menus (sidebar card on desktop, header avatar on mobile)
    this.bindAccountMenu("sidebar-profile-trigger", "sidebar-profile-menu");
    this.bindAccountMenu("header-avatar-btn", "header-profile-menu");

    // Header chat shortcut -> AI Assistant
    const chatBtn = document.getElementById("header-chat-btn");
    if (chatBtn) chatBtn.addEventListener("click", () => this.navigate("assistant"));

    // Sidebar: slide-down "Campus" group + report shortcut
    const groupBtn = document.getElementById("nav-group-btn");
    const groupBody = document.getElementById("nav-group-body");
    if (groupBtn && groupBody) {
      groupBtn.addEventListener("click", () => {
        const isOpen = groupBody.classList.toggle("open");
        groupBtn.classList.toggle("open", isOpen);
        setSidebarGroupOpen(isOpen);
      });
    }
    const reportBtn = document.getElementById("sidebar-report-btn");
    if (reportBtn) reportBtn.addEventListener("click", () => modals.openLostReportModal());

    // Global Search Trigger in Header
    const searchTrigger = document.getElementById("global-search-trigger");
    if (searchTrigger) {
      searchTrigger.addEventListener("click", () => this.openGlobalSearch());
    }

    // Header dropdowns: theme + notifications
    this.bindMenu("theme-toggle-btn", "theme-toggle-dropdown");
    const themeMenu = document.getElementById("theme-toggle-dropdown");
    if (themeMenu) {
      themeMenu.querySelectorAll(".theme-option-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          setThemePreference(btn.dataset.themeOption);
          this.render();
        });
      });
    }
    this.bindMenu("notifications-btn", "notifications-dropdown");
    const notifMatchItem = document.getElementById("notif-match-item");
    if (notifMatchItem) {
      notifMatchItem.addEventListener("click", () => {
        this.closeMenus();
        modals.openMatchResultModal(lostAndFoundItems.activeMatch);
      });
    }
  }
}

// Instantiate and start app on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  window.unipulse = new UniPulseApp();
  window.unipulse.init();
});


/* Publishes real header / bottom-nav heights as CSS variables so full-height
   views (Map, AI Assistant) fit exactly on phones, whatever the browser chrome does. */
function syncLayoutVars() {
  const root = document.documentElement;
  const header = document.querySelector(".up-header");
  const nav = document.querySelector(".up-mobile-nav");
  if (header && header.offsetHeight) root.style.setProperty("--up-header-h", header.offsetHeight + "px");
  if (nav && nav.offsetHeight) root.style.setProperty("--up-nav-h", nav.offsetHeight + "px");
}
window.addEventListener("resize", syncLayoutVars);
window.addEventListener("orientationchange", syncLayoutVars);
