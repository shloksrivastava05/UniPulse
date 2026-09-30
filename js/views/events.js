/**
 * UniPulse Campus Events View
 * Personalized event discovery with AI recommendation rationale,
 * category filters, and real-time RSVP interactions.
 */

import { campusEvents } from "../data.js";
import { toasts } from "../components/toasts.js";

export function renderEvents() {
  const filterCategories = ["All", "Today", "This Week", "Tech", "Workshops", "Clubs", "Sports", "Cultural"];

  return `
    <div class="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <span class="w-2 h-2 rounded-full bg-purple-600"></span>
            <span>AI Event Discovery</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Campus Events & Activities
          </h2>
          <p class="text-sm md:text-base text-slate-500 mt-1 font-medium">
            Explore hackathons, workshops, music sessions, and varsity sports tailored to your interests.
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3 shrink-0">
          <span class="text-2xl">🎉</span>
          <div class="text-xs">
            <span class="font-bold text-slate-900 block">4 Activities Today</span>
            <span class="text-slate-500">24 upcoming this week</span>
          </div>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        ${filterCategories.map((cat, idx) => `
          <button 
            class="event-category-filter px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors btn-press ${
              idx === 0 
                ? "bg-indigo-600 text-white shadow-2xs" 
                : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
            }"
            data-category="${cat}"
          >
            ${cat}
          </button>
        `).join("")}
      </div>

      <!-- Section 1: Recommended For You (AI Personalization) -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Recommended For You</h3>
          <span class="text-xs text-indigo-600 font-medium ml-auto">Matched with your major & interests</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${campusEvents.slice(0, 2).map(evt => `
            <div class="event-card p-6 rounded-[24px] bg-gradient-to-br from-indigo-50/50 via-white to-white border border-indigo-200/90 shadow-xs card-hover flex flex-col justify-between" data-category="${evt.category}" data-date="${evt.date}">
              <div>
                <div class="h-48 rounded-2xl overflow-hidden mb-4 relative shadow-inner">
                  <img src="${evt.image}" alt="${evt.title}" class="w-full h-full object-cover">
                  <span class="absolute top-3 left-3 bg-indigo-900/90 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                    ${evt.category}
                  </span>
                  <span class="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1 rounded-xl text-[11px] font-bold shadow-sm">
                    ${evt.badge}
                  </span>
                </div>

                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-100/70 text-indigo-800 text-xs font-semibold mb-2">
                  <span>✨</span>
                  <span>${evt.aiRecommendationReason}</span>
                </div>

                <h4 class="text-lg font-extrabold text-slate-900 leading-snug">${evt.title}</h4>
                <p class="text-xs text-slate-600 mt-2 leading-relaxed">${evt.description}</p>

                <div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500 font-medium">
                  <p>📅 ${evt.date} • ${evt.time}</p>
                  <p>📍 ${evt.location}</p>
                  <p>🏛️ ${evt.organizer}</p>
                  <p>👥 ${evt.attendeesCount} Registered</p>
                </div>
              </div>

              <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button class="save-event-btn text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5" data-id="${evt.id}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  <span>Bookmark</span>
                </button>
                <button class="rsvp-event-btn px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold btn-press shadow-md shadow-indigo-200" data-id="${evt.id}">
                  RSVP for Event
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Section 2: All Campus Events Grid -->
      <div class="space-y-4 pt-4">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Campus Directory of Events</h3>
        </div>

        <div id="events-grid" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${campusEvents.map(evt => `
            <div class="event-card p-5 rounded-[20px] bg-white border border-slate-200/80 shadow-xs card-hover flex flex-col justify-between" data-category="${evt.category}" data-date="${evt.date}">
              <div>
                <div class="h-40 rounded-xl overflow-hidden mb-3 relative">
                  <img src="${evt.image}" alt="${evt.title}" class="w-full h-full object-cover">
                  <span class="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                    ${evt.category}
                  </span>
                </div>
                <h4 class="font-bold text-base text-slate-900 leading-snug">${evt.title}</h4>
                <p class="text-xs text-slate-500 mt-1 line-clamp-2">${evt.description}</p>
                <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <p>📅 ${evt.date} • ${evt.time}</p>
                  <p>📍 ${evt.location}</p>
                  <p>👥 ${evt.attendeesCount} attending</p>
                </div>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[11px] font-bold text-indigo-600">${evt.organizer}</span>
                <button class="rsvp-event-btn px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold btn-press transition-colors" data-id="${evt.id}">
                  RSVP
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

    </div>
  `;
}

export function initEventsListeners() {
  // Category Filtering
  document.querySelectorAll(".event-category-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".event-category-filter").forEach(b => {
        b.className = "event-category-filter px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors btn-press bg-white border border-slate-200 hover:bg-slate-50 text-slate-700";
      });
      btn.className = "event-category-filter px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors btn-press bg-indigo-600 text-white shadow-2xs";

      const cat = btn.dataset.category;
      document.querySelectorAll(".event-card").forEach(card => {
        const cardCat = card.dataset.category;
        const cardDate = card.dataset.date;

        let visible = false;
        if (cat === "All") visible = true;
        else if (cat === "Today" && cardDate.toLowerCase().includes("today")) visible = true;
        else if (cat === "This Week") visible = true;
        else if (cardCat.toLowerCase() === cat.toLowerCase()) visible = true;

        if (visible) card.classList.remove("hidden");
        else card.classList.add("hidden");
      });
    });
  });

  // RSVP Buttons
  document.querySelectorAll(".rsvp-event-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const evtId = btn.dataset.id;
      const evt = campusEvents.find(e => e.id === evtId) || campusEvents[0];
      btn.textContent = "✓ Confirmed (RSVP'd)";
      btn.classList.remove("bg-slate-900", "bg-indigo-600");
      btn.classList.add("bg-emerald-600");

      toasts.show({
        title: "RSVP Confirmed!",
        message: `You are registered for "${evt.title}". Added to your student calendar.`,
        type: "success"
      });
    });
  });

  // Bookmark Buttons
  document.querySelectorAll(".save-event-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      toasts.show({
        title: "Event Bookmarked",
        message: "Saved to your student profile bookmarks.",
        type: "info"
      });
    });
  });
}
