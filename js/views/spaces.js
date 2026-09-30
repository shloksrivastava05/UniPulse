/**
 * UniPulse Study Spaces View
 * Dedicated availability page with live seat capacity meters, noise level atmosphere ratings,
 * amenity tags, and instant desk reservation flows.
 */

import { studySpaces } from "../data.js";
import { modals } from "../components/modals.js";

export function renderSpaces() {
  return `
    <div class="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      <!-- Top Title & Overview -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Live Campus IoT Seat Sensors</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Live Study Spaces
          </h2>
          <p class="text-sm md:text-base text-slate-500 mt-1 font-medium">
            Find quiet focus carrels, collaborative coding labs, and study spaces across campus in real-time.
          </p>
        </div>

        <!-- Campus Aggregate Availability Meter -->
        <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 shrink-0">
          <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
            68%
          </div>
          <div class="text-xs">
            <span class="font-bold text-slate-900 block">Campus Occupancy</span>
            <span class="text-slate-500">148 desks open right now</span>
          </div>
        </div>
      </div>

      <!-- Filters Row -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[20px] bg-white border border-slate-200/80 shadow-xs">
        <!-- Noise Filter Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">Noise Level:</span>
          <button class="space-filter-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-2xs" data-filter="all">All</button>
          <button class="space-filter-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200/70 text-slate-700" data-filter="Silent">Silent Focus</button>
          <button class="space-filter-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200/70 text-slate-700" data-filter="Moderate">Moderate</button>
          <button class="space-filter-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200/70 text-slate-700" data-filter="Collaborative">Collaborative</button>
        </div>

        <!-- Checkbox / Toggle for Amenities -->
        <div class="flex items-center gap-4 text-xs font-medium text-slate-600">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" id="filter-outlets" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
            <span>Power Outlets Only</span>
          </label>
        </div>
      </div>

      <!-- Study Space Cards Grid -->
      <div id="spaces-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${studySpaces.map(space => {
          const occupancyPct = Math.round(((space.capacity - space.availableDesks) / space.capacity) * 100);
          const isHighAvail = space.availableDesks > 5;

          return `
            <div class="study-space-card p-5 rounded-[24px] bg-white border border-slate-200/80 shadow-xs card-hover flex flex-col justify-between" data-noise="${space.noiseLevel}">
              <div>
                <!-- Top Badge & Hours -->
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    space.noiseLevel === "Silent" 
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                      : space.noiseLevel === "Collaborative"
                      ? "bg-indigo-50 text-indigo-800 border border-indigo-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }">
                    ${space.noiseLevel} Atmosphere
                  </span>
                  <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    ${space.hours}
                  </span>
                </div>

                <!-- Thumbnail -->
                <div class="h-40 rounded-xl overflow-hidden mb-4 bg-slate-100 relative">
                  <img src="${space.image}" alt="${space.name}" class="w-full h-full object-cover">
                  <span class="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    ${space.floor}
                  </span>
                </div>

                <!-- Title & Location -->
                <h4 class="font-bold text-base text-slate-900 leading-snug">${space.name}</h4>
                <p class="text-xs text-slate-500 mt-0.5">${space.buildingName} • ${space.distance} (${space.walkTime} walk)</p>

                <!-- Seating Availability Gauge -->
                <div class="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold ${isHighAvail ? "text-emerald-700" : "text-amber-700"}">
                      ${space.availableDesks} of ${space.capacity} Desks Open
                    </span>
                    <span class="text-slate-400 font-medium">${occupancyPct}% full</span>
                  </div>
                  <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div class="h-full rounded-full ${isHighAvail ? "bg-emerald-500" : "bg-amber-500"}" style="width: ${occupancyPct}%"></div>
                  </div>
                </div>

                <!-- Amenities Checklist -->
                <div class="mt-4 space-y-1.5">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Amenities</span>
                  <div class="flex flex-wrap gap-1.5">
                    ${space.amenities.map(a => `
                      <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                        ✓ ${a}
                      </span>
                    `).join("")}
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button class="reserve-desk-btn flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold btn-press shadow-sm shadow-indigo-200" data-id="${space.id}">
                  Reserve Desk
                </button>
                <button class="locate-space-btn px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold btn-press" data-bld="${space.buildingId}">
                  Locate
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>

    </div>
  `;
}

export function initSpacesListeners(onNavigate) {
  // Reserve Button
  document.querySelectorAll(".reserve-desk-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const spaceId = btn.dataset.id;
      const space = studySpaces.find(s => s.id === spaceId) || studySpaces[0];
      modals.openReserveSpaceModal(space);
    });
  });

  // Locate on map
  document.querySelectorAll(".locate-space-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const bldId = btn.dataset.bld;
      if (onNavigate) {
        onNavigate("campusMap", { selectedBuildingId: bldId });
      }
    });
  });

  // Noise Filter Pills
  document.querySelectorAll(".space-filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".space-filter-pill").forEach(p => {
        p.className = "space-filter-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200/70 text-slate-700";
      });
      pill.className = "space-filter-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-2xs";

      const filter = pill.dataset.filter;
      document.querySelectorAll(".study-space-card").forEach(card => {
        const noise = card.dataset.noise;
        if (filter === "all" || noise === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}
