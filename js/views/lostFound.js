/**
 * UniPulse Lost & Found View
 * Flagship module featuring dual prominent CTAs, active 91% AI match hero banner,
 * explainable match indicators, listings feed, and category filters.
 */

import { lostAndFoundItems, mockUser } from "../data.js";
import { modals } from "../components/modals.js";

export function renderLostFound() {
  const { activeMatch, recentListings } = lostAndFoundItems;

  return `
    <div class="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      <!-- Top Section: Header & Two Prominent Action CTAs -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>AI Multi-Factor Visual Matching</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Smart Lost & Found
          </h2>
          <p class="text-sm md:text-base text-slate-500 mt-1 font-medium">
            Turn in or recover belongings with computer vision and explainable cross-campus verification.
          </p>
        </div>

        <!-- Two Prominent Action Buttons -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <!-- Action 1: I Lost Something -->
          <button id="btn-i-lost" class="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 btn-press flex items-center justify-center gap-2.5 transition-all">
            <div class="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <span>I Lost Something</span>
          </button>

          <!-- Action 2: I Found Something -->
          <button id="btn-i-found" class="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-200 btn-press flex items-center justify-center gap-2.5 transition-all">
            <div class="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span>I Found Something</span>
          </button>
        </div>
      </div>

      <!-- Flagship Hero Banner: 91% AI Match Result Highlight -->
      <div class="p-6 md:p-8 rounded-[24px] bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-xl relative overflow-hidden">
        <div class="absolute -right-16 -bottom-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-3 max-w-xl">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-400 text-slate-950 shadow-sm">
                Possible Match Found
              </span>
              <span class="text-xs text-indigo-300 font-medium">Auto-detected 45m ago</span>
            </div>
            <h3 class="text-2xl md:text-3xl font-black tracking-tight text-white">
              Navy Blue Hydro Flask (32oz)
            </h3>
            <p class="text-xs md:text-sm text-indigo-200/90 leading-relaxed font-medium">
              We identified a turn-in at Student Commons Level 1 Info Desk that closely matches your lost item report with identical brand emblem and sticker arrangement.
            </p>

            <!-- Explainable Match Factors Mini-Row -->
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-indigo-200 font-medium">
              <span class="flex items-center gap-1.5 text-emerald-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                Similar appearance
              </span>
              <span class="flex items-center gap-1.5 text-emerald-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                Same category (Drinkware)
              </span>
              <span class="flex items-center gap-1.5 text-emerald-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                Same location (Commons)
              </span>
              <span class="flex items-center gap-1.5 text-emerald-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                Time window match
              </span>
            </div>
          </div>

          <!-- Circular Score & Inspection Trigger -->
          <div class="flex flex-col sm:flex-row items-center gap-4 shrink-0 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
            <div class="relative w-16 h-16 flex items-center justify-center">
              <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-white/20" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="text-emerald-400 match-circle" stroke-dasharray="100, 100" stroke-dashoffset="9" stroke-linecap="round" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span class="absolute text-base font-black text-white">91%</span>
            </div>
            <div class="text-center sm:text-left">
              <p class="text-xs font-bold uppercase tracking-wider text-emerald-300">High Confidence</p>
              <p class="text-xs text-indigo-200">Vision & Time Correlation</p>
              <button id="hero-inspect-match-btn" class="mt-2.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-md btn-press transition-colors">
                View Side-by-Side Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Feed Controls: Search & Category Filters -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <!-- Type Filter Tabs -->
          <div class="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 w-fit">
            <button class="lf-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-white text-slate-900 shadow-2xs" data-tab="all">
              All Listings
            </button>
            <button class="lf-tab-btn px-4 py-2 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:text-slate-900" data-tab="lost">
              Lost (2)
            </button>
            <button class="lf-tab-btn px-4 py-2 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:text-slate-900" data-tab="found">
              Found & Turn-ins (4)
            </button>
            <button class="lf-tab-btn px-4 py-2 rounded-xl text-xs font-semibold transition-all text-emerald-700 hover:text-emerald-800" data-tab="matched">
              AI Matched (1)
            </button>
          </div>

          <!-- Search Bar -->
          <div class="relative w-full sm:w-72">
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              type="text" 
              id="lf-search-input" 
              placeholder="Search items, locations..." 
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 bg-white"
            >
          </div>
        </div>

        <!-- Category Pills -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button class="lf-cat-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-2xs" data-cat="All">All Categories</button>
          <button class="lf-cat-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700" data-cat="Electronics">Electronics & Audio</button>
          <button class="lf-cat-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700" data-cat="Drinkware">Drinkware</button>
          <button class="lf-cat-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700" data-cat="Personal Accessories">Personal Accessories</button>
          <button class="lf-cat-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700" data-cat="Academic Equipment">Academic Equipment</button>
        </div>
      </div>

      <!-- Listings Grid -->
      <div id="lf-listings-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Always include the active matched Hydro Flask item card -->
        <div class="lf-item-card p-5 rounded-[20px] bg-white border border-indigo-200 shadow-xs card-hover flex flex-col justify-between" data-type="matched" data-category="Drinkware">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                91% Match Found
              </span>
              <span class="text-xs text-slate-400 font-medium">Today, 2:00 PM</span>
            </div>
            <div class="h-44 rounded-xl overflow-hidden mb-3 bg-slate-100 relative">
              <img src="${activeMatch.foundItem.image}" alt="${activeMatch.foundItem.name}" class="w-full h-full object-cover">
              <span class="absolute bottom-2 left-2 bg-indigo-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                Turned In @ Commons
              </span>
            </div>
            <h4 class="font-bold text-base text-slate-900 leading-snug">${activeMatch.foundItem.name}</h4>
            <p class="text-xs text-slate-500 mt-1 line-clamp-2">${activeMatch.foundItem.description}</p>
            <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <p>📍 Location: Student Commons Lounge</p>
              <p>🏷️ Category: Drinkware</p>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100">
            <button class="open-match-card-btn w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold btn-press shadow-sm shadow-indigo-200">
              Inspect 91% Match
            </button>
          </div>
        </div>

        <!-- Remaining Mock Listings -->
        ${recentListings.map(item => `
          <div class="lf-item-card p-5 rounded-[20px] bg-white border border-slate-200/80 shadow-xs card-hover flex flex-col justify-between" data-type="${item.type}" data-category="${item.category}">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  item.type === "found" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }">
                  ${item.type === "found" ? "Found / Turn-in" : "Lost Report"}
                </span>
                <span class="text-xs text-slate-400 font-medium">${item.date}</span>
              </div>
              <div class="h-44 rounded-xl overflow-hidden mb-3 bg-slate-100 relative">
                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
                <span class="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  ${item.status}
                </span>
              </div>
              <h4 class="font-bold text-base text-slate-900 leading-snug">${item.title}</h4>
              <p class="text-xs text-slate-500 mt-1 line-clamp-2">${item.description}</p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <p>📍 Location: ${item.location}</p>
                <p>🏷️ Category: ${item.category}</p>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100">
              <button class="lf-view-detail-btn w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold btn-press" data-id="${item.id}">
                View Details
              </button>
            </div>
          </div>
        `).join("")}
      </div>

    </div>
  `;
}

export function initLostFoundListeners() {
  // Action Buttons: I Lost / I Found
  const lostBtn = document.getElementById("btn-i-lost");
  const foundBtn = document.getElementById("btn-i-found");

  if (lostBtn) {
    lostBtn.addEventListener("click", () => modals.openLostReportModal());
  }
  if (foundBtn) {
    foundBtn.addEventListener("click", () => modals.openFoundReportModal());
  }

  // Inspect Match Buttons
  const heroInspectBtn = document.getElementById("hero-inspect-match-btn");
  if (heroInspectBtn) {
    heroInspectBtn.addEventListener("click", () => modals.openMatchResultModal(lostAndFoundItems.activeMatch));
  }

  document.querySelectorAll(".open-match-card-btn").forEach(btn => {
    btn.addEventListener("click", () => modals.openMatchResultModal(lostAndFoundItems.activeMatch));
  });

  // Tab Filtering (All / Lost / Found / Matched)
  let activeTab = "all";
  let activeCat = "All";

  const filterCards = () => {
    const q = (document.getElementById("lf-search-input")?.value || "").toLowerCase().trim();

    document.querySelectorAll(".lf-item-card").forEach(card => {
      const type = card.dataset.type;
      const cat = card.dataset.category;
      const text = card.textContent.toLowerCase();

      const matchesTab = (activeTab === "all") || (activeTab === "matched" && type === "matched") || (type === activeTab);
      const matchesCat = (activeCat === "All") || (cat === activeCat);
      const matchesSearch = !q || text.includes(q);

      if (matchesTab && matchesCat && matchesSearch) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  };

  document.querySelectorAll(".lf-tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".lf-tab-btn").forEach(t => {
        t.className = "lf-tab-btn px-4 py-2 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:text-slate-900";
      });
      tab.className = "lf-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-white text-slate-900 shadow-2xs";

      activeTab = tab.dataset.tab;
      filterCards();
    });
  });

  // Category Filtering
  document.querySelectorAll(".lf-cat-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".lf-cat-pill").forEach(p => {
        p.className = "lf-cat-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700";
      });
      pill.className = "lf-cat-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-2xs";

      activeCat = pill.dataset.cat;
      filterCards();
    });
  });

  // Search Input
  const searchInput = document.getElementById("lf-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", filterCards);
  }
}
