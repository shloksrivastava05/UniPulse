/**
 * UniPulse Dashboard View
 * Features dynamic student greeting, rotating hero search bar, quick actions,
 * AI suggestions, campus snapshot metrics, and curated "For You" event cards.
 */

import { mockUser, studySpaces, campusEvents, lostAndFoundItems, adminMetrics } from "../data.js";
import { modals } from "../components/modals.js";
import { toasts } from "../components/toasts.js";

const dashIc = (d, c = "w-[17px] h-[17px]") => `<svg class="${c}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="${d}"/></svg>`;

function dashDates(n, step) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * step);
    out.push(String(d.getDate()).padStart(2, "0") + "." + String(d.getMonth() + 1).padStart(2, "0"));
  }
  return out;
}

const DASH_WEEK = adminMetrics.weeklyReportsTrend;
const DASH_OPEN_SEATS = studySpaces.reduce((n, s) => n + (s.availableDesks || 0), 0);
const DASH_UTIL = parseInt(adminMetrics.spacesUtilization, 10) || 68;
const DASH_HOURS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

// Week view and utilization come from the same data the Admin console uses; the other ranges are demo series.
const DASH_RANGES = {
  today: { sub: "Today", x: DASH_HOURS, y: [3, 6, 10, 8, 12, 7, 4], util: DASH_UTIL + 3, bars: [30, 45, 60, 40, 72, 55, 80, 66, 48, 58, 70, 52] },
  yesterday: { sub: "Yesterday", x: DASH_HOURS, y: [4, 5, 8, 11, 9, 5, 3], util: DASH_UTIL - 4, bars: [42, 50, 38, 66, 58, 74, 49, 61, 55, 40, 68, 47] },
  week: { sub: "Last 7 days", x: DASH_WEEK.map(d => d.day), y: DASH_WEEK.map(d => d.lost + d.found), util: DASH_UTIL, bars: [35, 58, 44, 70, 62, 84, 52, 76, 60, 88, 66, 72] },
  month: { sub: "Last 30 days", x: dashDates(8, 4), y: [210, 245, 232, 268, 251, 290, 262, 275], util: DASH_UTIL - 2, bars: [50, 62, 58, 74, 68, 80, 72, 90, 64, 78, 70, 84] }
};

function dashAreaChart(x, y) {
  const W = 520, H = 170, L = 26, R = 10, T = 30, Bt = 22;
  const step = Math.ceil(Math.max(4, Math.max(...y)) / 4), ymax = step * 4;
  const px = i => L + i * (W - L - R) / (y.length - 1);
  const py = v => T + (H - T - Bt) * (1 - v / ymax);
  const pts = y.map((v, i) => [px(i), py(v)]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  const area = `${d} L${px(y.length - 1)},${py(0)} L${px(0)},${py(0)} Z`;
  const peak = y.indexOf(Math.max(...y));
  const tipX = Math.min(Math.max(px(peak) - 34, L), W - R - 68);
  const grid = [0, 1, 2, 3, 4].map(k => `<line x1="${L}" x2="${W - R}" y1="${py(k * step)}" y2="${py(k * step)}" stroke="#94A3B8" stroke-opacity=".18"/><text x="${L - 8}" y="${py(k * step) + 3}" text-anchor="end" font-size="9" fill="#94A3B8">${k * step}</text>`).join("");
  const labels = x.map((t, i) => `<text x="${px(i)}" y="${H - 6}" text-anchor="middle" font-size="9" fill="#94A3B8">${t}</text>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto" role="img" aria-label="Reports over time">
    <defs><linearGradient id="dashAg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6656E8" stop-opacity=".38"/><stop offset="1" stop-color="#6656E8" stop-opacity=".02"/></linearGradient></defs>
    ${grid}<path d="${area}" fill="url(#dashAg)"/><path d="${d}" fill="none" stroke="#6656E8" stroke-width="1.6"/>
    <circle cx="${px(peak)}" cy="${py(y[peak])}" r="3.5" fill="#fff" stroke="#6656E8" stroke-width="2"/>
    <rect x="${tipX}" y="${py(y[peak]) - 28}" width="68" height="18" rx="4" fill="#6656E8"/>
    <text x="${tipX + 34}" y="${py(y[peak]) - 15.5}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#fff">${y[peak]} reports</text>
    ${labels}</svg>`;
}

function dashStats(key) {
  const r = DASH_RANGES[key], C = 2 * Math.PI * 34;
  return `
    <div class="up-card p-4 lg:col-span-6">
      <div class="flex items-start justify-between">
        <div><p class="text-[12px] font-bold text-slate-900">Lost &amp; Found Reports</p><p class="text-[10px] text-slate-400">${r.sub}</p></div>
        <span class="up-tag bad">Reports count</span>
      </div>
      <div class="mt-2">${dashAreaChart(r.x, r.y)}</div>
    </div>
    <div class="up-card p-4 lg:col-span-3 flex flex-col">
      <p class="text-[12px] font-bold text-slate-900">Seat Utilization</p><p class="text-[10px] text-slate-400">${r.sub}</p>
      <div class="flex-1 flex items-center justify-center py-3 text-slate-900">
        <svg viewBox="0 0 96 96" class="w-28 h-28" role="img" aria-label="${r.util}% utilization">
          <circle cx="48" cy="48" r="34" fill="none" stroke="#6656E8" stroke-opacity=".15" stroke-width="5"/>
          <circle cx="48" cy="48" r="34" fill="none" stroke="#6656E8" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C * r.util / 100} ${C}" transform="rotate(-90 48 48)"/>
          <text x="48" y="52" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">${r.util}%</text>
        </svg>
      </div>
    </div>
    <div class="up-card p-4 lg:col-span-3 flex flex-col">
      <p class="text-[12px] font-bold text-slate-900">Assistant Queries</p><p class="text-[10px] text-slate-400">${r.sub}</p>
      <div class="flex-1 flex items-end gap-1 pt-3 min-h-[110px]">
        ${r.bars.map(v => `<div class="up-bar-track flex-1 h-full rounded-full flex items-end"><div class="up-bar-fill w-full rounded-full" style="height:${v}%"></div></div>`).join("")}
      </div>
    </div>`;
}

export function renderDashboard() {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric" }).replace(/\//g, ".");
  const events = campusEvents.slice(0, 2);
  const rows = [
    { m: "AI match found for your Navy Hydro Flask", o: "Student Commons", t: "10:39", tag: "91% match", cls: "ok" },
    { m: "Desk pass issued for Discussion Room 304", o: "Block 34", t: "10:12", tag: "Active", cls: "info" },
    { m: "Hackathon team matching is open", o: "Innovation Lab", t: "09:41", tag: "5 days left", cls: "warn" }
  ];
  const menu = [
    { id: "assistant", t: "AI Assistant", s: "Ask anything", d: "M13 10V3L4 14h7v7l9-11h-7z", primary: true },
    { id: "campusMap", t: "Campus Finder", s: "Map & routes", d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" },
    { id: "lostFound", t: "Lost & Found", s: lostAndFoundItems.activeMatch ? "1 new match" : "No new matches", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { id: "spaces", t: "Study Spaces", s: DASH_OPEN_SEATS + " seats open", d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { id: "events", t: "Events", s: campusEvents.length + " upcoming", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }
  ];

  return `
    <div class="px-5 md:px-7 pt-2 pb-10 space-y-6 animate-fade-in">

      <!-- Ask AI -->
      <div>
        <form id="hero-search-form" class="up-card flex items-center gap-2 p-1.5 pl-4">
          <span class="text-indigo-500">${dashIc("M13 10V3L4 14h7v7l9-11h-7z")}</span>
          <input type="text" id="hero-ai-input" class="flex-1 bg-transparent py-2 text-[13px] font-medium text-slate-900 placeholder-slate-400 focus:outline-none" placeholder="Find a quiet place to study...">
          <button type="submit" class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold btn-press">Ask AI</button>
        </form>
        <div class="flex flex-wrap items-center gap-2 mt-2.5 text-[11px]">
          <button class="hero-chip px-2.5 py-1 rounded-md up-glass text-slate-500 hover:text-indigo-600" data-prompt="I have 40 minutes free. Where can I study quietly?">40 mins free: where to study quietly?</button>
          <button class="hero-chip px-2.5 py-1 rounded-md up-glass text-slate-500 hover:text-indigo-600" data-prompt="Where is Block 34 and how do I get there?">Where is Block 34?</button>
          <button class="hero-chip px-2.5 py-1 rounded-md up-glass text-slate-500 hover:text-indigo-600" data-prompt="I lost my blue Hydro Flask bottle earlier today">I lost my blue Hydro Flask</button>
        </div>
      </div>

      <!-- Recent Activity -->
      <section>
        <div class="flex flex-wrap gap-2 items-center justify-between mb-2.5">
          <h2 class="up-h">Recent Activity</h2>
          <div class="flex items-center gap-2">
            <button id="hero-lost-modal-btn" class="px-3 py-1.5 rounded-lg up-glass text-[11px] font-semibold text-slate-700 hover:text-indigo-600 btn-press">+ Report item</button>
            <button id="hero-ai-match-btn" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold btn-press">View 91% AI match</button>
          </div>
        </div>
        <div class="up-card overflow-x-auto">
          <table class="w-full text-[11.5px]">
            <thead><tr><th class="up-th w-10">Type</th><th class="up-th">Message</th><th class="up-th">Location</th><th class="up-th">Date</th><th class="up-th">Time</th><th class="up-th">Status</th></tr></thead>
            <tbody>
              ${rows.map(r => `<tr><td class="up-td text-slate-400">${dashIc("M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z", "w-3.5 h-3.5")}</td><td class="up-td font-medium">${r.m}</td><td class="up-td">${r.o}</td><td class="up-td">${today}</td><td class="up-td">${r.t}</td><td class="up-td"><span class="up-tag ${r.cls}">${r.tag}</span></td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Menu -->
      <section>
        <h2 class="up-h mb-2.5">Menu</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
          ${menu.map(m => `<button data-action="${m.id}" class="quick-action-card up-tile ${m.primary ? "is-primary" : ""}">${dashIc(m.d, "w-[18px] h-[18px]")}<span><span class="t block">${m.t}</span><span class="s block">${m.s}</span></span></button>`).join("")}
        </div>
      </section>

      <!-- Statistics -->
      <section>
        <div class="flex flex-wrap gap-2 items-center justify-between mb-2.5">
          <h2 class="up-h">Statistics</h2>
          <div class="flex items-center gap-1">
            ${Object.keys(DASH_RANGES).map(k => `<button class="up-range up-pill ${k === "week" ? "on" : ""}" data-range="${k}">${DASH_RANGES[k].sub}</button>`).join("")}
          </div>
        </div>
        <div id="stats-grid" class="grid grid-cols-1 lg:grid-cols-12 gap-3">${dashStats("week")}</div>
      </section>

      <!-- Events & Notice -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div class="up-card p-4 lg:col-span-8">
          <div class="flex items-center justify-between mb-2">
            <p class="text-[12px] font-bold text-slate-900">Recommended For You</p>
            <button data-action="events" class="text-[11px] font-semibold text-indigo-600 hover:underline">View all events</button>
          </div>
          <div class="divide-y divide-slate-100">
            ${events.map(e => `<div class="py-2.5 flex items-center gap-3"><img src="${e.image}" alt="" class="w-11 h-11 rounded-lg object-cover shrink-0"><div class="min-w-0 flex-1"><p class="text-[12px] font-semibold text-slate-900 truncate">${e.title}</p><p class="text-[11px] text-slate-500 truncate">${e.date} • ${e.time} • ${e.location}</p></div><span class="hidden md:inline text-[10.5px] text-indigo-600 font-medium truncate max-w-[200px]">${e.aiRecommendationReason}</span><button class="dash-rsvp-btn px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold btn-press shrink-0" data-id="${e.id}">RSVP</button></div>`).join("")}
          </div>
        </div>
        <div class="up-card p-4 lg:col-span-4">
          <p class="text-[12px] font-bold text-slate-900 mb-2">Campus Notice</p>
          <div class="p-3 rounded-lg bg-amber-50/80 text-[11.5px]">
            <p class="font-bold text-amber-900">Library Level 4 maintenance</p>
            <p class="text-amber-800 mt-1 leading-relaxed">Electrical upgrades until 10:00 PM. Levels 1 to 3 stay open with 100+ quiet desks.</p>
          </div>
          <button data-action="campusMap" class="mt-3 w-full py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold btn-press">Open campus map</button>
        </div>
      </div>
    </div>
  `;
}

export function initDashboardListeners(onNavigate) {
  // Rotating placeholder in AI input
  const aiInput = document.getElementById("hero-ai-input");
  const placeholders = [
    "Find a quiet place to study...",
    "Where is Block 34?",
    "I lost my water bottle...",
    "What events are happening today?",
    "Are there open seats in the Library?"
  ];
  let placeholderIndex = 0;
  let placeholderInterval = null;

  if (aiInput) {
    placeholderInterval = setInterval(() => {
      placeholderIndex = (placeholderIndex + 1) % placeholders.length;
      aiInput.placeholder = placeholders[placeholderIndex];
    }, 3200);
  }

  // Handle Hero Search Form Submission
  const heroForm = document.getElementById("hero-search-form");
  if (heroForm) {
    heroForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = aiInput ? aiInput.value.trim() : "";
      if (onNavigate) {
        onNavigate("assistant", { initialQuery: query || aiInput.placeholder });
      }
    });
  }

  // Handle Suggested Prompt Chips
  document.querySelectorAll(".hero-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const prompt = chip.dataset.prompt;
      if (onNavigate) {
        onNavigate("assistant", { initialQuery: prompt });
      }
    });
  });

  // Handle Quick Action Cards
  document.querySelectorAll(".quick-action-card, button[data-action]").forEach(card => {
    card.addEventListener("click", () => {
      const target = card.dataset.action;
      if (target && onNavigate) {
        onNavigate(target);
      }
    });
  });

  // Handle Report Lost Item Button
  const heroLostBtn = document.getElementById("hero-lost-modal-btn");
  if (heroLostBtn) {
    heroLostBtn.addEventListener("click", () => {
      modals.openLostReportModal();
    });
  }

  // Handle View 91% AI Match Button
  const heroMatchBtn = document.getElementById("hero-ai-match-btn");
  const suggestionMatchBtn = document.getElementById("suggestion-match-btn");
  const openMatch = () => modals.openMatchResultModal(lostAndFoundItems.activeMatch);

  if (heroMatchBtn) heroMatchBtn.addEventListener("click", openMatch);
  if (suggestionMatchBtn) suggestionMatchBtn.addEventListener("click", openMatch);

  // RSVP buttons in the recommended list
  document.querySelectorAll(".dash-rsvp-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const evt = campusEvents.find(e => e.id === btn.dataset.id);
      if (!evt) return;
      btn.textContent = "RSVP'd";
      btn.disabled = true;
      btn.classList.remove("bg-indigo-600", "hover:bg-indigo-700");
      btn.classList.add("bg-emerald-600");
      toasts.show({ title: "RSVP Confirmed!", message: `You are registered for "${evt.title}".`, type: "success" });
    });
  });

  // Statistics range pills
  const statsHost = document.getElementById("stats-grid");
  document.querySelectorAll(".up-range").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".up-range").forEach(b => b.classList.toggle("on", b === btn));
      if (statsHost) statsHost.innerHTML = dashStats(btn.dataset.range);
    });
  });

  return () => {
    if (placeholderInterval) clearInterval(placeholderInterval);
  };
}
