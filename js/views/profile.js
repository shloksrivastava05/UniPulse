/**
 * UniPulse Student Profile View
 * Displays student credentials, academic details, customizable interest tags,
 * report tracking timeline, saved events, and notification preferences.
 */

import { mockUser, campusEvents, lostAndFoundItems } from "../data.js";
import { toasts } from "../components/toasts.js";
import { modals } from "../components/modals.js";
import { getThemePreference, setThemePreference, getThemeToggleIconMarkup, THEME_OPTIONS } from "../theme.js";

export function renderProfile() {
  const savedEvents = campusEvents.filter(e => mockUser.savedEventIds.includes(e.id));

  return `
    <div class="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      <!-- Profile Header Card -->
      <div class="p-6 md:p-8 rounded-[24px] bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div class="relative">
            <img src="${mockUser.avatar}" alt="${mockUser.name}" class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md">
            <span class="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" title="Verified Student"></span>
          </div>
          <div>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 class="text-2xl font-black text-slate-900">${mockUser.name}</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                Verified Student
              </span>
            </div>
            <p class="text-sm font-semibold text-slate-700 mt-1">${mockUser.course}</p>
            <p class="text-xs text-slate-400 mt-0.5">${mockUser.department} • ${mockUser.year}</p>
            <p class="text-xs font-mono text-slate-400 mt-1">Student ID: ${mockUser.studentId}</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button id="profile-edit-interests-btn" class="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold btn-press">
            Edit Interests
          </button>
          <button id="profile-share-id-btn" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 btn-press">
            Digital Student Pass
          </button>
        </div>
      </div>

      <!-- Interest Tags (Influences AI Recommendations) -->
      <div class="p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Academic & Social Interests</h3>
            <p class="text-xs text-slate-400">UniPulse AI uses these tags to recommend campus events and study groups.</p>
          </div>
          <button id="add-interest-prompt-btn" class="text-xs font-bold text-indigo-600 hover:underline">+ Add Topic</button>
        </div>

        <div class="flex flex-wrap gap-2" id="profile-interests-container">
          ${mockUser.interests.map(interest => `
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-200/70 text-indigo-900 text-xs font-semibold">
              <span>${interest}</span>
              <button class="remove-interest-btn text-indigo-400 hover:text-indigo-800" data-interest="${interest}">×</button>
            </span>
          `).join("")}
        </div>
      </div>

      <!-- Two Columns: My Reports & Saved Events -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Column 1: My Lost & Found Reports -->
        <div class="p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">My Lost & Found Reports</h3>
              <p class="text-xs text-slate-400">Active status and AI matching history</p>
            </div>
            <button id="profile-report-btn" class="text-xs font-bold text-indigo-600 hover:underline">+ New Report</button>
          </div>

          <div class="space-y-3">
            ${mockUser.myReports.map(rep => `
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
                <img src="${rep.image}" alt="${rep.title}" class="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <h5 class="text-xs font-bold text-slate-900 truncate">${rep.title}</h5>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rep.status === "AI Matched" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }">
                      ${rep.status} ${rep.matchScore ? `(${rep.matchScore}%)` : ""}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-1">📍 ${rep.location}</p>
                  <p class="text-[11px] text-slate-400">${rep.date}</p>
                  ${rep.matchScore ? `
                    <button class="profile-view-match-btn text-xs font-bold text-indigo-600 hover:underline mt-2 inline-block">
                      View 91% Match Details →
                    </button>
                  ` : ""}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Column 2: Saved Events -->
        <div class="p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Saved Campus Events</h3>
              <p class="text-xs text-slate-400">Your registered workshops & activities</p>
            </div>
            <span class="text-xs font-bold text-slate-500">${savedEvents.length} Saved</span>
          </div>

          <div class="space-y-3">
            ${savedEvents.map(evt => `
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
                <img src="${evt.image}" alt="${evt.title}" class="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0">
                <div class="flex-1 min-w-0">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-purple-700">${evt.category}</span>
                  <h5 class="text-xs font-bold text-slate-900 truncate mt-0.5">${evt.title}</h5>
                  <p class="text-[11px] text-slate-500 mt-1">📅 ${evt.date} • ${evt.time}</p>
                  <p class="text-[11px] text-slate-400">📍 ${evt.location}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

      </div>

      <!-- Appearance -->
      <div class="p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Appearance</h3>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p class="font-bold text-slate-800 text-xs">Theme</p>
            <p class="text-slate-500 mt-0.5 text-xs">Choose how UniPulse looks on this device.</p>
          </div>
          <div id="profile-theme-options" class="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-50 border border-slate-200/80">
            ${THEME_OPTIONS.map(opt => `
              <button data-theme-option="${opt.value}" class="profile-theme-option-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${opt.value === getThemePreference() ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}">
                ${getThemeToggleIconMarkup(opt.value)}
                <span>${opt.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Notification Preferences -->
      <div class="p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Notification Preferences</h3>
        <div class="divide-y divide-slate-100 text-xs">
          <div class="py-3 flex items-center justify-between">
            <div>
              <p class="font-bold text-slate-800">AI Lost & Found Match Alerts</p>
              <p class="text-slate-500 mt-0.5">Instant notification when vision models detect a 85%+ match for your reported belongings.</p>
            </div>
            <input type="checkbox" checked class="pref-toggle rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4">
          </div>
          <div class="py-3 flex items-center justify-between">
            <div>
              <p class="font-bold text-slate-800">Study Space Openings</p>
              <p class="text-slate-500 mt-0.5">Receive an alert when your preferred quiet study rooms drop below 50% capacity.</p>
            </div>
            <input type="checkbox" checked class="pref-toggle rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4">
          </div>
          <div class="py-3 flex items-center justify-between">
            <div>
              <p class="font-bold text-slate-800">Campus Event Reminders</p>
              <p class="text-slate-500 mt-0.5">Remind me 1 hour prior to bookmarked events and club meetings.</p>
            </div>
            <input type="checkbox" checked class="pref-toggle rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4">
          </div>
        </div>
      </div>

    </div>
  `;
}

export function initProfileListeners() {
  // Appearance: Theme option buttons
  document.querySelectorAll(".profile-theme-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setThemePreference(btn.dataset.themeOption);
      if (window.unipulse) {
        window.unipulse.render();
      }
    });
  });

  // View Match from report
  document.querySelectorAll(".profile-view-match-btn").forEach(btn => {
    btn.addEventListener("click", () => modals.openMatchResultModal(lostAndFoundItems.activeMatch));
  });

  // Digital pass
  const passBtn = document.getElementById("profile-share-id-btn");
  if (passBtn) {
    passBtn.addEventListener("click", () => {
      toasts.show({
        title: "Digital Pass Active",
        message: "STU-8829104 verified with Campus NFC & Security barcode.",
        type: "success"
      });
    });
  }

  // Remove interest
  document.querySelectorAll(".remove-interest-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const topic = btn.dataset.interest;
      btn.parentElement.remove();
      toasts.show({
        title: "Interest Removed",
        message: `Removed "${topic}" from your recommendation preferences.`,
        type: "info"
      });
    });
  });

  // Add interest prompt
  const addBtn = document.getElementById("add-interest-prompt-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const topic = prompt("Enter a new interest or topic (e.g. Cybersecurity, Photography, Tennis):");
      if (topic && topic.trim()) {
        const container = document.getElementById("profile-interests-container");
        const span = document.createElement("span");
        span.className = "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-200/70 text-indigo-900 text-xs font-semibold animate-fade-in";
        span.innerHTML = `<span>${topic.trim()}</span><button class="remove-interest-btn text-indigo-400 hover:text-indigo-800">×</button>`;
        container.appendChild(span);
        toasts.show({
          title: "Interest Added",
          message: `Added "${topic.trim()}" to your recommendation profile.`,
          type: "success"
        });
      }
    });
  }

  // New report
  const reportBtn = document.getElementById("profile-report-btn");
  if (reportBtn) {
    reportBtn.addEventListener("click", () => modals.openLostReportModal());
  }
}
