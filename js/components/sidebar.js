/**
 * UniPulse Sidebar Component
 * Glass sidebar with badges, a collapsible "Campus" group (slide-down tree), collapsible rail and user card.
 */

import { mockUser, lostAndFoundItems } from "../data.js";
import { auth } from "../auth.js";

const sbIcon = (d) => `<svg class="w-[15px] h-[15px] shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="${d}"/></svg>`;

let sbGroupOpen = true;
export function setSidebarGroupOpen(v) { sbGroupOpen = !!v; }

const SB_TOP = [
  { id: "dashboard", label: "Home", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "assistant", label: "AI Assistant", badge: "AI", d: "M13 10V3L4 14h7v7l9-11h-7z" },
  { id: "lostFound", label: "Lost & Found", badge: "1", ok: true, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }
];
const SB_GROUP = [
  { id: "campusMap", label: "Campus Finder", d: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
  { id: "spaces", label: "Spaces", d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { id: "events", label: "Events", badge: "New", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }
];
const SB_BOTTOM = [
  { id: "profile", label: "Profile", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }
];

export function renderSidebar(currentRoute = "dashboard", isAdminMode = false, collapsed = false) {
  const navBtn = (n, active, extra = "") => `
    <button ${extra} data-route="${n.id}" title="${n.label}" class="nav-link-btn up-nav ${active ? "is-active" : ""}">
      ${sbIcon(n.d)}
      <span class="up-label flex-1 text-left">${n.label}</span>
      ${n.badge ? `<span class="up-label up-badge ${n.ok ? "ok" : ""}">${n.badge}</span>` : ""}
    </button>`;
  const act = (id) => currentRoute === id && !isAdminMode;
  const inGroup = SB_GROUP.some(g => act(g.id));
  const open = sbGroupOpen || inGroup;

  const groupHtml = collapsed
    ? SB_GROUP.map(n => navBtn(n, act(n.id))).join("")
    : `
      <button id="nav-group-btn" class="up-nav up-group-btn ${open ? "open" : ""} ${inGroup ? "has-active" : ""}">
        ${sbIcon("M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z")}
        <span class="up-label flex-1 text-left">Campus</span>
        <svg class="up-chev w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div id="nav-group-body" class="up-collapsible ${open ? "open" : ""}">
        <div><div class="up-tree">
          ${SB_GROUP.map(n => `<button data-route="${n.id}" class="nav-link-btn up-sub ${act(n.id) ? "is-active" : ""}"><span>${n.label}</span>${n.badge ? `<span class="up-badge">${n.badge}</span>` : ""}</button>`).join("")}
        </div></div>
      </div>`;

  return `
    <aside class="up-sidebar ${collapsed ? "collapsed" : ""}">
      <button id="sidebar-collapse-btn" class="up-collapse" aria-label="Toggle sidebar" title="Toggle sidebar">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="${collapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}"/></svg>
      </button>

      <div>
        <div class="up-brand">
          <div id="brand-logo-btn" class="flex items-center gap-2.5 cursor-pointer min-w-0">
            <div class="up-logo">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="12,4 18.93,8 18.93,16 12,20 5.07,16 5.07,8" stroke-width="2.4" stroke-linejoin="round"/><polyline points="7,12 9,12 10.5,8.5 13,15.5 14.5,12 17,12" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <span class="up-label">UniPulse</span>
          </div>
        </div>

        <nav>
          ${SB_TOP.map(n => navBtn(n.id === "lostFound" ? { ...n, badge: lostAndFoundItems.activeMatch ? "1" : "" } : n, act(n.id))).join("")}
          ${groupHtml}
          ${SB_BOTTOM.map(n => navBtn(n, act(n.id))).join("")}
          ${!auth.isAdmin() ? "" : navBtn({ id: "admin", label: "Admin Console", badge: "Staff", d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }, isAdminMode, 'id="admin-nav-btn"')}
        </nav>
      </div>

      <div class="up-foot">
        <button id="sidebar-report-btn" class="up-cta up-label">+ Report lost item</button>
        <div class="up-mode up-label">
          <span class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full ${isAdminMode ? "bg-amber-400" : "bg-emerald-400"}"></span>${isAdminMode ? "Admin Console" : "Student View"}</span>
          ${auth.isAdmin() ? `<button id="toggle-role-mode-btn">${isAdminMode ? "Student" : "Admin"}</button>` : ""}
        </div>
        <div class="relative">
          ${renderAccountMenu("sidebar-profile-menu", "bottom-full left-0 mb-2 up-slide-up")}
          <div class="up-user" id="sidebar-profile-trigger" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false">
            <img src="${mockUser.avatar}" alt="${mockUser.name}" class="w-8 h-8 rounded-full object-cover shrink-0">
            <div class="up-label min-w-0 flex-1">
              <p class="truncate text-[12px] font-semibold text-white">${auth.isAdmin() ? "Campus Operations" : mockUser.name}</p>
              <p class="truncate text-[10.5px]" style="color:#9A98AE">${auth.isAdmin() ? "Staff" : "CS '27"} • ${(auth.session() || {}).id || ""}</p>
            </div>
            <svg class="up-label w-3.5 h-3.5 shrink-0" style="color:#9A98AE" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"/></svg>
          </div>
        </div>
      </div>
    </aside>
  `;
}

export function renderMobileNav(currentRoute = "dashboard") {
  const mobileItems = [
    { id: "dashboard", label: "Home", icon: "🏠" },
    { id: "assistant", label: "AI", icon: "✨" },
    { id: "campusMap", label: "Map", icon: "🗺️" },
    { id: "lostFound", label: "Lost&Found", icon: "🔍" },
    { id: "spaces", label: "Spaces", icon: "📚" },
    { id: "events", label: "Events", icon: "📅" }
  ];

  return `
    <nav class="up-mobile-nav md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 py-2 flex items-center justify-around shadow-lg">
      ${mobileItems.map(item => `
        <button data-route="${item.id}" class="mobile-nav-btn flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[11px] font-semibold ${
          currentRoute === item.id ? "text-indigo-600 font-bold" : "text-slate-500"
        }">
          <span class="text-lg">${item.icon}</span>
          <span>${item.label}</span>
        </button>
      `).join("")}
    </nav>
  `;
}

export function renderAccountMenu(id, position) {
  const item = (attrs, label) => `<button role="menuitem" ${attrs} class="up-menu-item">${label}</button>`;
  return `
    <div id="${id}" role="menu" class="hidden absolute ${position} w-60 glass-dropdown rounded-2xl py-2 z-50">
      ${item('data-menu-route="profile"', "Profile Settings")}
      ${item('data-menu-route="profile"', "View Profile")}
      <div class="up-menu-sep" role="separator"></div>
      ${item('data-menu-route="campusMap"', "Campus Finder")}
      ${item('data-menu-route="spaces"', "Study Spaces")}
      ${item('data-menu-route="events"', "Events")}
      <div class="up-menu-sep" role="separator"></div>
      ${auth.isAdmin() ? item('data-menu-route="admin"', "Admin Console") : ""}
      ${item('data-menu-logout="1"', "Log out")}
    </div>`;
}
