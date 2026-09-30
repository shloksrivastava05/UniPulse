/**
 * UniPulse Global Header Component
 * Contains page title, Cmd+K global search trigger, campus location badge, and notifications flyout.
 */

import { mockUser } from "../data.js";
import { renderAccountMenu } from "./sidebar.js";
import { getThemePreference, isDarkActive, getThemeToggleIconMarkup, THEME_OPTIONS } from "../theme.js";

const routeMeta = {
  dashboard: {
    title: "Campus Hub",
    subtitle: "Real-time updates, AI suggestions, and student services"
  },
  assistant: {
    title: "AI Campus Assistant",
    subtitle: "Ask anything about courses, facilities, study spaces, or lost items"
  },
  campusMap: {
    title: "Interactive Campus Finder",
    subtitle: "Vector campus directory, real-time walking routes, and facility statuses"
  },
  lostFound: {
    title: "Smart Lost & Found",
    subtitle: "Explainable multi-factor AI matching for university belongings"
  },
  spaces: {
    title: "Live Study Spaces",
    subtitle: "Real-time desk availability, noise atmosphere ratings, and instant booking"
  },
  events: {
    title: "Campus Events & Activities",
    subtitle: "Personalized recommendations, student clubs, and tech hackathons"
  },
  profile: {
    title: "Student Profile",
    subtitle: "Manage academic details, interests, and report history"
  },
  admin: {
    title: "Administration Console",
    subtitle: "Campus-wide service analytics, capacity monitoring, and report auditing"
  }
};

export function renderHeader(currentRoute = "dashboard") {
  const meta = routeMeta[currentRoute] || routeMeta.dashboard;
  const activeThemePref = getThemePreference();

  return `
    <header class="up-header">
      <div class="min-w-0">
        <h1 class="text-[22px] leading-7 font-extrabold tracking-tight text-slate-900 truncate">${meta.title}</h1>
        <div class="mt-1 flex items-center gap-4 text-[11px] text-slate-500 min-w-0">
          <span class="inline-flex items-center gap-1.5 shrink-0 font-medium"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Live</span>
          <span class="hidden md:inline truncate">${meta.subtitle}</span>
          <span class="hidden xl:inline-flex items-center gap-1 shrink-0 text-slate-400"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>North Campus, Science Quad</span>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button id="global-search-trigger" class="up-search btn-press">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <span class="hidden sm:inline flex-1 text-left">Search</span>
          <kbd class="hidden sm:inline-block">⌘K</kbd>
        </button>

        <div class="flex items-center gap-2 ml-1">
          <button id="header-chat-btn" class="up-circle-btn btn-press" title="Ask the AI assistant" aria-label="Ask the AI assistant">
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.83L3 20l1.3-3.9C3.48 14.9 3 13.5 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </button>

          <!-- Theme Toggle with Flyout Dropdown -->
          <div class="relative" id="theme-toggle-wrapper">
            <button id="theme-toggle-btn" class="up-circle-btn btn-press" title="Change appearance" aria-label="Change appearance">
              ${getThemeToggleIconMarkup(isDarkActive() ? "dark" : "light")}
            </button>

            <div id="theme-toggle-dropdown" class="hidden absolute right-0 mt-2 w-44 glass-dropdown rounded-2xl p-1.5 z-50 up-slide-down shadow-xl">
              ${THEME_OPTIONS.map(opt => `
                <button data-theme-option="${opt.value}" class="theme-option-btn w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${opt.value === activeThemePref ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}">
                  ${getThemeToggleIconMarkup(opt.value)}
                  <span class="flex-1 text-left">${opt.label}</span>
                  ${opt.value === activeThemePref ? '<svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>' : ''}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Notification Bell with Flyout Dropdown -->
          <div class="relative" id="notifications-wrapper">
            <button id="notifications-btn" class="up-circle-btn btn-press">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            </button>

            <!-- Notifications Dropdown -->
            <div id="notifications-dropdown" class="hidden absolute right-0 mt-2 w-80 sm:w-96 glass-dropdown rounded-2xl p-4 z-50 up-slide-down shadow-xl">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 class="text-sm font-bold text-slate-900">Notifications</h4>
                <span class="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer">Mark all as read</span>
              </div>
              <div class="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                <!-- Item 1: AI Match Alert -->
                <div class="py-3 flex items-start gap-3 hover:bg-slate-50/80 p-2 rounded-xl cursor-pointer" id="notif-match-item">
                  <div class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 text-sm">
                    ✨
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-900">AI Match Detected: 91% Match</p>
                    <p class="text-[11px] text-slate-600 mt-0.5">Found item matching your "Navy Blue Hydro Flask" turned in at Student Commons.</p>
                    <span class="text-[10px] text-indigo-600 font-semibold mt-1 inline-block">12 minutes ago • Click to review</span>
                  </div>
                </div>

                <!-- Item 2: Space Alert -->
                <div class="py-3 flex items-start gap-3 hover:bg-slate-50/80 p-2 rounded-xl cursor-pointer">
                  <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-sm">
                    📚
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-900">Study Space Openings</p>
                    <p class="text-[11px] text-slate-600 mt-0.5">Discussion Room 304 in Block 34 is currently unoccupied.</p>
                    <span class="text-[10px] text-slate-400 mt-1 inline-block">35 minutes ago</span>
                  </div>
                </div>

                <!-- Item 3: Event RSVP -->
                <div class="py-3 flex items-start gap-3 hover:bg-slate-50/80 p-2 rounded-xl cursor-pointer">
                  <div class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 text-sm">
                    🚀
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-900">Hackathon Team Matching</p>
                    <p class="text-[11px] text-slate-600 mt-0.5">Agentic AI Hackathon starts in 5 days. 3 students looking for front-end teammates.</p>
                    <span class="text-[10px] text-slate-400 mt-1 inline-block">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Account menu (mobile only; on desktop it lives in the sidebar) -->
          <div class="relative md:hidden">
            <button id="header-avatar-btn" class="flex items-center rounded-full" aria-haspopup="true" aria-expanded="false" aria-label="Account menu"><img src="${mockUser.avatar}" alt="${mockUser.name}" class="w-8 h-8 rounded-full object-cover"></button>
            ${renderAccountMenu("header-profile-menu", "right-0 mt-3 up-slide-down")}
          </div>

        </div>
      </div>
    </header>
  `;
}
