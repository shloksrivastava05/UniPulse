/**
 * UniPulse Campus Finder View
 * Features an interactive vector SVG campus map with user beacon,
 * animated walking route polylines, building node highlights, and facility details.
 */

import { campusBuildings, mockUser } from "../data.js";
import { toasts } from "../components/toasts.js";

export function renderCampusMap(selectedBuildingId = "bld-34") {
  const selectedBuilding = campusBuildings.find(b => b.id === selectedBuildingId) || campusBuildings[0];

  const categories = [
    { id: "All", label: "All Facilities" },
    { id: "Academic", label: "Academic" },
    { id: "Study", label: "Study" },
    { id: "Food", label: "Food & Dining" },
    { id: "Medical", label: "Medical" },
    { id: "Sports", label: "Sports" },
    { id: "Administration", label: "Administration" }
  ];

  return `
    <div class="up-view-h flex flex-col md:flex-row overflow-hidden animate-fade-in bg-slate-100/60">
      
      <!-- Left Panel: Search, Category Filters, Building List -->
      <aside class="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200/80 flex flex-col h-[40%] md:h-full min-h-0 shrink-0 z-10 shadow-xs">
        <!-- Search Bar -->
        <div class="p-4 border-b border-slate-100">
          <div class="relative">
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              type="text" 
              id="map-building-search" 
              placeholder="Search campus buildings, labs..." 
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 bg-slate-50 focus:bg-white transition-all"
            >
          </div>

          <!-- Category Filter Pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3">
            ${categories.map((cat, idx) => `
              <button 
                class="map-category-filter px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors btn-press ${
                  idx === 0 
                    ? "bg-indigo-600 text-white shadow-2xs" 
                    : "bg-slate-100 hover:bg-slate-200/70 text-slate-600"
                }"
                data-category="${cat.id}"
              >
                ${cat.label}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Buildings List -->
        <div id="map-building-list" class="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          ${campusBuildings.map(b => {
            const isSelected = b.id === selectedBuilding.id;
            return `
              <div 
                class="building-list-item p-3.5 rounded-xl cursor-pointer transition-all duration-150 ${
                  isSelected ? "bg-indigo-50/80 border border-indigo-200" : "hover:bg-slate-50"
                }"
                data-id="${b.id}"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider ${
                      isSelected ? "text-indigo-700" : "text-slate-400"
                    }">
                      ${b.category} • ${b.code}
                    </span>
                    <h5 class="text-sm font-bold text-slate-900 mt-0.5 leading-snug">${b.shortName}</h5>
                    <p class="text-xs text-slate-500 mt-0.5">${b.faculty}</p>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    b.status.includes("Open") ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                  }">
                    ${b.status}
                  </span>
                </div>
                <div class="mt-2.5 pt-2 border-t ${isSelected ? "border-indigo-100" : "border-slate-100"} flex items-center justify-between text-xs text-slate-500">
                  <span>📍 ${b.distance} away</span>
                  <span class="font-medium text-slate-700">⏱️ ${b.walkingTime}</span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </aside>

      <!-- Center: Interactive Vector Campus Map -->
      <main class="flex-1 min-h-0 relative flex flex-col bg-[#F3F6F8] overflow-hidden">
        
        <!-- Map Floating Controls -->
        <div class="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div class="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-800">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-600 beacon"></span>
            <span>Live Campus Navigation</span>
          </div>
          <div class="hidden sm:block bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-600">
            Weather: 72°F • Clear
          </div>
        </div>

        <!-- High-Fidelity SVG Campus Map Area -->
        <div class="w-full h-full flex items-center justify-center p-4 relative overflow-auto" id="svg-map-wrapper">
          <svg 
            id="campus-svg"
            viewBox="0 0 800 550" 
            preserveAspectRatio="xMidYMid meet"
            class="up-map-svg w-full h-full drop-shadow-md rounded-2xl select-none"
            style="background: #EBF2F7;"
          >
            <defs>
              <!-- Lawn Pattern -->
              <pattern id="lawn-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="#E2EED8"/>
                <circle cx="10" cy="10" r="0.8" fill="#C8DDBA" opacity="0.6"/>
              </pattern>
              
              <!-- Gradient for water pond -->
              <linearGradient id="pond-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#BAE6FD" />
                <stop offset="100%" stop-color="#7DD3FC" />
              </linearGradient>

              <!-- Route gradient -->
              <linearGradient id="route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#6366F1" />
                <stop offset="100%" stop-color="#4F46E5" />
              </linearGradient>
            </defs>

            <!-- Campus Perimeter & Green Lawns -->
            <rect x="20" y="20" width="760" height="510" rx="20" fill="#EDF3E9" stroke="#D3E2CC" stroke-width="2"/>
            
            <!-- Science Quad Central Lawn -->
            <path d="M 230 150 L 530 150 L 530 330 L 230 330 Z" rx="16" fill="url(#lawn-pattern)" stroke="#CDE0BF" stroke-width="1.5"/>
            
            <!-- Reflective Central Pond & Fountain -->
            <ellipse cx="380" cy="240" rx="65" ry="38" fill="url(#pond-grad)" stroke="#93C5FD" stroke-width="2"/>
            <circle cx="380" cy="240" r="6" fill="#38BDF8" opacity="0.8"/>
            <text x="380" y="244" text-anchor="middle" font-size="8" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" fill="#0369A1">FOUNTAIN</text>

            <!-- Main Campus Pathways (Pedestrian Walkways) -->
            <g stroke="#CBD5E1" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none">
              <!-- Horizontal main spine -->
              <path d="M 80 280 L 720 280" />
              <!-- Diagonal quad paths -->
              <path d="M 280 190 L 380 240 L 480 340" />
              <path d="M 480 190 L 380 240 L 280 340" />
              <!-- North-South spines -->
              <path d="M 200 100 L 200 450" />
              <path d="M 600 100 L 600 450" />
            </g>

            <!-- Inner pathway highlights -->
            <g stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none">
              <path d="M 80 280 L 720 280" />
              <path d="M 280 190 L 380 240 L 480 340" />
              <path d="M 480 190 L 380 240 L 280 340" />
              <path d="M 200 100 L 200 450" />
              <path d="M 600 100 L 600 450" />
            </g>

            <!-- Dynamic Walking Route Polyline -->
            <path 
              id="active-route-line" 
              d="M 420 280 L 380 280 L 315 232" 
              fill="none" 
              stroke="#4F46E5" 
              stroke-width="4" 
              class="map-route-line"
              stroke-linecap="round"
            />

            <!-- Building Nodes (Vector Rectangles) -->
            ${campusBuildings.map(b => {
              const { x, y, width, height } = b.mapCoords;
              const isSelected = b.id === selectedBuilding.id;
              return `
                <g class="building-svg-node cursor-pointer transition-transform" data-id="${b.id}">
                  <!-- Building Drop Shadow -->
                  <rect x="${x+3}" y="${y+4}" width="${width}" height="${height}" rx="12" fill="rgba(15, 23, 42, 0.08)"/>
                  <!-- Building Base -->
                  <rect 
                    id="svg-rect-${b.id}"
                    x="${x}" 
                    y="${y}" 
                    width="${width}" 
                    height="${height}" 
                    rx="12" 
                    fill="${isSelected ? "#4F46E5" : "#FFFFFF"}" 
                    stroke="${isSelected ? "#3730A3" : "#CBD5E1"}" 
                    stroke-width="${isSelected ? "2.5" : "1.5"}"
                    class="transition-colors duration-200"
                  />
                  <!-- Building Label -->
                  <text 
                    id="svg-text-${b.id}"
                    x="${x + width/2}" 
                    y="${y + height/2 - 4}" 
                    text-anchor="middle" 
                    font-size="10" 
                    font-family="Plus Jakarta Sans, sans-serif" 
                    font-weight="800" 
                    fill="${isSelected ? "#FFFFFF" : "#0F172A"}"
                  >
                    ${b.code}
                  </text>
                  <text 
                    id="svg-subtext-${b.id}"
                    x="${x + width/2}" 
                    y="${y + height/2 + 10}" 
                    text-anchor="middle" 
                    font-size="8" 
                    font-family="Plus Jakarta Sans, sans-serif" 
                    font-weight="600" 
                    fill="${isSelected ? "#E0E7FF" : "#64748B"}"
                  >
                    ${b.shortName}
                  </text>
                </g>
              `;
            }).join("")}

            <!-- Selection Pulse Ring (repositioned onto whichever building is selected) -->
            <g id="selection-pulse-ring" transform="translate(${selectedBuilding.mapCoords.x + selectedBuilding.mapCoords.width / 2}, ${selectedBuilding.mapCoords.y + selectedBuilding.mapCoords.height / 2})" style="pointer-events: none;">
              <circle r="30" fill="none" stroke="#4F46E5" stroke-width="3" opacity="0.55" class="beacon"/>
            </g>

            <!-- User "You Are Here" Beacon -->
            <g id="user-location-marker" transform="translate(420, 280)">
              <circle cx="0" cy="0" r="14" fill="rgba(99, 102, 241, 0.25)" class="beacon"/>
              <circle cx="0" cy="0" r="7" fill="#4F46E5" stroke="#FFFFFF" stroke-width="2.5"/>
              <!-- Badge -->
              <rect x="-32" y="-28" width="64" height="18" rx="6" fill="#0F172A" opacity="0.9"/>
              <text x="0" y="-16" text-anchor="middle" font-size="8" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" fill="#FFFFFF">YOU ARE HERE</text>
            </g>

          </svg>
        </div>

      </main>

      <!-- Right Detail Information Panel for Selected Building -->
      <aside class="w-full md:w-80 lg:w-96 bg-white border-t md:border-t-0 md:border-l border-slate-200/80 p-6 flex flex-col justify-between shrink-0 overflow-y-auto">
        <div class="space-y-5" id="building-detail-pane">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full" id="detail-category">
                ${selectedBuilding.category} • ${selectedBuilding.code}
              </span>
              <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full" id="detail-status">
                ${selectedBuilding.status}
              </span>
            </div>
            <h3 class="text-xl font-black text-slate-900 leading-tight" id="detail-name">
              ${selectedBuilding.name}
            </h3>
            <p class="text-xs text-slate-500 mt-1 font-medium" id="detail-faculty">
              ${selectedBuilding.faculty}
            </p>
          </div>

          <div class="h-40 rounded-2xl overflow-hidden relative shadow-inner border border-slate-100">
            <img src="${selectedBuilding.image}" id="detail-img" alt="${selectedBuilding.name}" class="w-full h-full object-cover">
          </div>

          <!-- Distance & Walk Time -->
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-[11px] font-medium text-slate-400 block">Distance</span>
              <span class="font-extrabold text-slate-900 text-sm mt-0.5 block" id="detail-distance">${selectedBuilding.distance}</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-[11px] font-medium text-slate-400 block">Walking Time</span>
              <span class="font-extrabold text-slate-900 text-sm mt-0.5 block" id="detail-walk">${selectedBuilding.walkingTime}</span>
            </div>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Hours of Operation</h4>
            <p class="text-xs font-semibold text-slate-800" id="detail-hours">${selectedBuilding.hours}</p>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Facilities inside</h4>
            <div class="space-y-1.5" id="detail-facilities">
              ${selectedBuilding.facilities.map(f => `
                <div class="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100/80">
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>${f}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- Navigate Action Button -->
        <div class="pt-5 border-t border-slate-100 mt-4">
          <button id="map-start-nav-btn" class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 btn-press flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>Start Live Walking Navigation</span>
          </button>
        </div>
      </aside>

    </div>
  `;
}

export function initCampusMapListeners(selectedBuildingId = "bld-34") {
  let activeBld = campusBuildings.find(b => b.id === selectedBuildingId) || campusBuildings[0];

  const updateSelectedBuilding = (bld) => {
    activeBld = bld;

    // Update list item highlights
    document.querySelectorAll(".building-list-item").forEach(item => {
      if (item.dataset.id === bld.id) {
        item.className = "building-list-item p-3.5 rounded-xl cursor-pointer transition-all duration-150 bg-indigo-50/80 border border-indigo-200";
      } else {
        item.className = "building-list-item p-3.5 rounded-xl cursor-pointer transition-all duration-150 hover:bg-slate-50";
      }
    });

    // Update SVG colors
    campusBuildings.forEach(item => {
      const rect = document.getElementById(`svg-rect-${item.id}`);
      const text = document.getElementById(`svg-text-${item.id}`);
      const subtext = document.getElementById(`svg-subtext-${item.id}`);
      if (rect && text && subtext) {
        if (item.id === bld.id) {
          rect.setAttribute("fill", "#4F46E5");
          rect.setAttribute("stroke", "#3730A3");
          rect.setAttribute("stroke-width", "2.5");
          text.setAttribute("fill", "#FFFFFF");
          subtext.setAttribute("fill", "#E0E7FF");
        } else {
          rect.setAttribute("fill", "#FFFFFF");
          rect.setAttribute("stroke", "#CBD5E1");
          rect.setAttribute("stroke-width", "1.5");
          text.setAttribute("fill", "#0F172A");
          subtext.setAttribute("fill", "#64748B");
        }
      }
    });

    // Update Dynamic Walking Route Line on SVG
    const routeLine = document.getElementById("active-route-line");
    if (routeLine) {
      const startX = 420;
      const startY = 280;
      const targetX = bld.mapCoords.x + bld.mapCoords.width / 2;
      const targetY = bld.mapCoords.y + bld.mapCoords.height / 2;

      // Draw path via spine
      const midX = (startX + targetX) / 2;
      routeLine.setAttribute("d", `M ${startX} ${startY} Q ${midX} ${startY} ${targetX} ${targetY}`);
    }

    // Move the pulsing selection ring onto the newly selected building, and
    // scroll it into view so it's never lost off-screen on smaller windows.
    const pulseRing = document.getElementById("selection-pulse-ring");
    if (pulseRing) {
      const cx = bld.mapCoords.x + bld.mapCoords.width / 2;
      const cy = bld.mapCoords.y + bld.mapCoords.height / 2;
      pulseRing.setAttribute("transform", `translate(${cx}, ${cy})`);
    }
    const selectedRect = document.getElementById(`svg-rect-${bld.id}`);
    if (selectedRect && selectedRect.scrollIntoView) {
      selectedRect.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }

    // Update Right Panel Details
    const detailPane = document.getElementById("building-detail-pane");
    if (detailPane) {
      document.getElementById("detail-category").textContent = `${bld.category} • ${bld.code}`;
      document.getElementById("detail-status").textContent = bld.status;
      document.getElementById("detail-name").textContent = bld.name;
      document.getElementById("detail-faculty").textContent = bld.faculty;
      document.getElementById("detail-img").src = bld.image;
      document.getElementById("detail-distance").textContent = bld.distance;
      document.getElementById("detail-walk").textContent = bld.walkingTime;
      document.getElementById("detail-hours").textContent = bld.hours;

      const facilitiesContainer = document.getElementById("detail-facilities");
      if (facilitiesContainer) {
        facilitiesContainer.innerHTML = bld.facilities.map(f => `
          <div class="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100/80">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>${f}</span>
          </div>
        `).join("");
      }
    }
  };

  // Attach SVG node click
  document.querySelectorAll(".building-svg-node").forEach(node => {
    node.addEventListener("click", () => {
      const bldId = node.dataset.id;
      const bld = campusBuildings.find(b => b.id === bldId);
      if (bld) updateSelectedBuilding(bld);
    });
  });

  // Attach Building List click
  document.querySelectorAll(".building-list-item").forEach(item => {
    item.addEventListener("click", () => {
      const bldId = item.dataset.id;
      const bld = campusBuildings.find(b => b.id === bldId);
      if (bld) updateSelectedBuilding(bld);
    });
  });

  // Attach Category Filter pills
  document.querySelectorAll(".map-category-filter").forEach(filterBtn => {
    filterBtn.addEventListener("click", () => {
      document.querySelectorAll(".map-category-filter").forEach(b => {
        b.className = "map-category-filter px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors btn-press bg-slate-100 hover:bg-slate-200/70 text-slate-600";
      });
      filterBtn.className = "map-category-filter px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors btn-press bg-indigo-600 text-white shadow-2xs";

      const cat = filterBtn.dataset.category;
      document.querySelectorAll(".building-list-item").forEach(item => {
        const bld = campusBuildings.find(b => b.id === item.dataset.id);
        if (!bld) return;
        if (cat === "All" || bld.category === cat) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });

  // Search input filter
  const searchInput = document.getElementById("map-building-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll(".building-list-item").forEach(item => {
        const bld = campusBuildings.find(b => b.id === item.dataset.id);
        if (!bld) return;
        const matches = bld.name.toLowerCase().includes(q) || bld.description.toLowerCase().includes(q) || bld.facilities.some(f => f.toLowerCase().includes(q));
        if (matches) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  }

  // Navigation button
  const navBtn = document.getElementById("map-start-nav-btn");
  if (navBtn) {
    navBtn.addEventListener("click", () => {
      toasts.show({
        title: "Walking Route Active",
        message: `Follow the highlighted route north towards ${activeBld.shortName} (${activeBld.distance}, ~${activeBld.walkingTime}).`,
        type: "success"
      });
    });
  }

  // Initial update
  updateSelectedBuilding(activeBld);
}
