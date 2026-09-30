/**
 * UniPulse AI Assistant View
 * Dedicated split-view conversational interface with structured response cards,
 * typing indicators, suggested prompts, and a dynamic Right Context Panel.
 */

import { studySpaces, campusBuildings, campusEvents, lostAndFoundItems, aiKnowledgeBase, mockUser, escapeHtml } from "../data.js";
import { modals } from "../components/modals.js";

export function renderAssistant(initialQuery = "") {
  return `
    <div class="up-view-h flex flex-col lg:flex-row overflow-hidden animate-fade-in bg-slate-50/50">
      
      <!-- Main Left/Center Column: Chat Conversation Thread -->
      <div class="flex-1 min-h-0 flex flex-col h-full bg-white border-r border-slate-200/80">
        
        <!-- Chat Header with AI Status Badge -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="12,4 18.93,8 18.93,16 12,20 5.07,16 5.07,8" stroke-width="2" stroke-linejoin="round"/><polyline points="7,12 9,12 10.5,8.5 13,15.5 14.5,12 17,12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-black text-slate-900 text-base">UniPulse AI Campus Guide</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Online</span>
              </div>
              <p class="text-xs text-slate-400">Contextual awareness enabled for North Campus</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button id="clear-chat-btn" class="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              Reset Chat
            </button>
          </div>
        </div>

        <!-- Chat Messages Container -->
        <div id="chat-messages-container" class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Initial Welcome Message from AI -->
          <div class="flex items-start gap-3.5 max-w-2xl">
            <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-sm shadow-sm shadow-indigo-200">
              ✨
            </div>
            <div class="space-y-3 flex-1">
              <div class="p-4 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed shadow-2xs">
                <p class="font-semibold text-slate-900">Hello Shlok! I am your UniPulse Campus Assistant.</p>
                <p class="mt-1 text-slate-600">
                  I have real-time access to campus maps, room occupancy sensors, lost & found logs, and event schedules.
                </p>
                <p class="mt-2 text-xs text-slate-500 font-medium">Try asking one of the examples below or type your own question.</p>
              </div>

              <!-- Quick Prompt Chips -->
              <div class="flex flex-wrap gap-2 pt-1">
                <button class="chat-prompt-pill px-3 py-1.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/60 text-xs font-semibold transition-all btn-press text-left" data-prompt="I have 40 minutes free. Where can I study quietly?">
                  📍 "I have 40 minutes free. Where can I study quietly?"
                </button>
                <button class="chat-prompt-pill px-3 py-1.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/60 text-xs font-semibold transition-all btn-press text-left" data-prompt="Where is Block 34 and how do I get there?">
                  🗺️ "Where is Block 34 and how do I get there?"
                </button>
                <button class="chat-prompt-pill px-3 py-1.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/60 text-xs font-semibold transition-all btn-press text-left" data-prompt="I lost my blue Hydro Flask bottle earlier today">
                  🔍 "I lost my blue Hydro Flask bottle earlier today"
                </button>
                <button class="chat-prompt-pill px-3 py-1.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/60 text-xs font-semibold transition-all btn-press text-left" data-prompt="What tech workshops are happening this weekend?">
                  📅 "What tech workshops are happening this weekend?"
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input Form -->
        <div class="p-4 border-t border-slate-200 bg-white">
          <form id="assistant-form" class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
            <input 
              type="text" 
              id="assistant-input" 
              placeholder="Ask about rooms, walking directions, study spots, or events..." 
              class="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              autocomplete="off"
            >
            <button 
              type="submit" 
              class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all btn-press shrink-0 flex items-center gap-1.5"
            >
              <span>Send</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </form>
          <div class="flex items-center justify-between px-3 pt-2 text-[11px] text-slate-400">
            <span>Powered by UniPulse Multi-Agent Campus Brain</span>
            <span class="hidden sm:inline">Press Enter to send</span>
          </div>
        </div>

      </div>

      <!-- Right Column: Dynamic Context Panel -->
      <aside class="hidden lg:block w-full lg:w-96 p-6 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200/80 overflow-y-auto shrink-0 space-y-6">
        <div>
          <div class="flex items-center justify-between mb-1">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Live Context Panel</h4>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Sync Active</span>
          </div>
          <p class="text-xs text-slate-400">Context cards update dynamically based on conversation</p>
        </div>

        <div id="assistant-context-container" class="space-y-4">
          <!-- Default Context Card: Current Location -->
          <div class="p-5 rounded-[20px] bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Position</span>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">GPS Active</span>
            </div>
            <h5 class="font-bold text-slate-900 text-sm">North Campus • Science Quad</h5>
            <p class="text-xs text-slate-500">Adjacent to Block 34 (Computer Science) and Central Lawns.</p>
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Nearest Facility:</span>
              <span class="font-semibold text-slate-900">Block 34 (120m)</span>
            </div>
          </div>

          <!-- Quick Highlight Card: 91% Match Status -->
          <div class="p-5 rounded-[20px] bg-indigo-50/60 border border-indigo-200/80 shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Lost & Found Alert</span>
              <span class="text-[10px] font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-full">91% Match</span>
            </div>
            <h5 class="font-bold text-indigo-950 text-sm">Navy Blue Hydro Flask 32oz</h5>
            <p class="text-xs text-indigo-800 leading-relaxed">Turned in at Student Commons Info Desk. Verified with octocat sticker.</p>
            <button id="context-view-match-btn" class="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold btn-press">
              Inspect AI Match Details
            </button>
          </div>
        </div>
      </aside>

    </div>
  `;
}

export function initAssistantListeners(onNavigate, initialQuery = "") {
  const container = document.getElementById("chat-messages-container");
  const form = document.getElementById("assistant-form");
  const input = document.getElementById("assistant-input");
  const contextContainer = document.getElementById("assistant-context-container");
  const clearBtn = document.getElementById("clear-chat-btn");

  const scrollToBottom = () => {
    if (container) container.scrollTop = container.scrollHeight;
  };

  const addUserMessage = (text) => {
    const userMsg = document.createElement("div");
    userMsg.className = "flex items-start justify-end gap-3 max-w-2xl ml-auto animate-fade-in";
    userMsg.innerHTML = `
      <div class="p-4 rounded-2xl rounded-tr-sm bg-indigo-600 text-white text-sm font-medium leading-relaxed shadow-sm shadow-indigo-200">
        <p>${escapeHtml(text)}</p>
      </div>
      <img src="${mockUser.avatar}" alt="Shlok" class="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0">
    `;
    container.appendChild(userMsg);
    scrollToBottom();
  };

  const showTypingIndicator = () => {
    const typing = document.createElement("div");
    typing.id = "ai-typing-indicator";
    typing.className = "flex items-center gap-3.5 max-w-md animate-fade-in";
    typing.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-sm shadow-sm shadow-indigo-200">
        ✨
      </div>
      <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-1.5 shadow-2xs">
        <span class="w-2 h-2 rounded-full bg-indigo-600 typing-dot"></span>
        <span class="w-2 h-2 rounded-full bg-indigo-600 typing-dot"></span>
        <span class="w-2 h-2 rounded-full bg-indigo-600 typing-dot"></span>
      </div>
    `;
    container.appendChild(typing);
    scrollToBottom();
    return typing;
  };

  const updateContextPanel = (type, data) => {
    if (!contextContainer) return;

    if (type === "spaces") {
      const topSpace = studySpaces[0];
      contextContainer.innerHTML = `
        <div class="p-5 rounded-[20px] bg-white border border-slate-200/80 shadow-xs space-y-3 animate-fade-in">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Featured Study Space</span>
            <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">${topSpace.availableDesks} open</span>
          </div>
          <div class="h-32 rounded-xl overflow-hidden relative">
            <img src="${topSpace.image}" alt="${topSpace.name}" class="w-full h-full object-cover">
          </div>
          <h5 class="font-bold text-slate-900 text-sm">${topSpace.name}</h5>
          <p class="text-xs text-slate-500">${topSpace.buildingName} • ${topSpace.distance} (${topSpace.walkTime})</p>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-700">Atmosphere: ${topSpace.noiseLevel}</span>
            <button class="context-reserve-btn px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold btn-press" data-id="${topSpace.id}">
              Reserve
            </button>
          </div>
        </div>
      `;
      contextContainer.querySelector(".context-reserve-btn")?.addEventListener("click", () => {
        modals.openReserveSpaceModal(topSpace);
      });
    } else if (type === "building") {
      const b = campusBuildings[0]; // Block 34
      contextContainer.innerHTML = `
        <div class="p-5 rounded-[20px] bg-white border border-slate-200/80 shadow-xs space-y-3 animate-fade-in">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campus Destination</span>
            <span class="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">${b.status}</span>
          </div>
          <div class="h-32 rounded-xl overflow-hidden relative">
            <img src="${b.image}" alt="${b.name}" class="w-full h-full object-cover">
          </div>
          <h5 class="font-bold text-slate-900 text-sm">${b.name}</h5>
          <p class="text-xs text-slate-500">${b.description}</p>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
            <span class="font-bold">Walking Route:</span> 120m via Science Quad paved walkway (~2 min)
          </div>
          <button class="context-nav-map-btn w-full py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold btn-press">
            Open Interactive Map
          </button>
        </div>
      `;
      contextContainer.querySelector(".context-nav-map-btn")?.addEventListener("click", () => {
        if (onNavigate) onNavigate("campusMap", { selectedBuildingId: b.id });
      });
    } else if (type === "match") {
      contextContainer.innerHTML = `
        <div class="p-5 rounded-[20px] bg-gradient-to-br from-indigo-50 to-white border border-indigo-200/80 shadow-xs space-y-3 animate-fade-in">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Verified AI Match</span>
            <span class="text-[10px] font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-full">91% Match</span>
          </div>
          <div class="h-32 rounded-xl overflow-hidden relative border border-indigo-100">
            <img src="${lostAndFoundItems.activeMatch.foundItem.image}" alt="Found Item" class="w-full h-full object-cover">
          </div>
          <h5 class="font-bold text-indigo-950 text-sm">${lostAndFoundItems.activeMatch.foundItem.name}</h5>
          <p class="text-xs text-slate-600">${lostAndFoundItems.activeMatch.foundItem.itemPickupLocation}</p>
          <button class="context-inspect-match-btn w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-200 btn-press">
            Open Side-by-Side Review
          </button>
        </div>
      `;
      contextContainer.querySelector(".context-inspect-match-btn")?.addEventListener("click", () => {
        modals.openMatchResultModal(lostAndFoundItems.activeMatch);
      });
    } else if (type === "events") {
      const topEvt = campusEvents[0];
      contextContainer.innerHTML = `
        <div class="p-5 rounded-[20px] bg-white border border-slate-200/80 shadow-xs space-y-3 animate-fade-in">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-purple-700">Top Event</span>
            <span class="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">Featured</span>
          </div>
          <div class="h-32 rounded-xl overflow-hidden relative">
            <img src="${topEvt.image}" alt="${topEvt.title}" class="w-full h-full object-cover">
          </div>
          <h5 class="font-bold text-slate-900 text-sm">${topEvt.title}</h5>
          <p class="text-xs text-slate-500">📅 ${topEvt.date} • ${topEvt.time}</p>
          <button class="context-event-btn w-full py-2 rounded-xl bg-purple-600 text-white text-xs font-bold btn-press">
            View Event Details & RSVP
          </button>
        </div>
      `;
      contextContainer.querySelector(".context-event-btn")?.addEventListener("click", () => {
        if (onNavigate) onNavigate("events");
      });
    }
  };

  const processQuery = (rawQuery) => {
    const query = rawQuery.toLowerCase();
    const typing = showTypingIndicator();

    setTimeout(() => {
      typing.remove();

      const aiMsg = document.createElement("div");
      aiMsg.className = "flex items-start gap-3.5 max-w-2xl animate-fade-in";

      let responseContent = "";

      // 1. Study query
      if (query.includes("study") || query.includes("quiet") || query.includes("desk") || query.includes("free") || query.includes("room")) {
        updateContextPanel("spaces");
        responseContent = `
          <div class="space-y-4">
            <div class="p-4 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed shadow-2xs">
              <p class="font-bold text-slate-900">I found 3 suitable places near you with low noise levels:</p>
              <p class="text-xs text-slate-500 mt-1">Filtered by walking distance from Science Quad.</p>
            </div>

            <!-- Structured Rich Cards for Study Places -->
            <div class="space-y-3">
              <!-- Place 1: Library Study Zone -->
              <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <h5 class="text-sm font-bold text-slate-900">1. Library Study Zone (Level 3)</h5>
                    <span class="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Silent</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>📍 280m (4 min walk)</span>
                    <span>🟢 14 / 45 desks open</span>
                    <span>⚡ Power outlets at all desks</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button class="chat-reserve-btn px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold btn-press" data-space-id="spc-1">
                    Reserve Desk
                  </button>
                  <button class="chat-nav-map-btn px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold btn-press" data-bld-id="bld-lib">
                    Navigate
                  </button>
                </div>
              </div>

              <!-- Place 2: Discussion Room Block 34 -->
              <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <h5 class="text-sm font-bold text-slate-900">2. Discussion Room 304 — Block 34</h5>
                    <span class="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Collaborative</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>📍 120m (2 min walk)</span>
                    <span>🟢 8 seats open</span>
                    <span>🖥️ 4K Display & Whiteboard</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button class="chat-reserve-btn px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold btn-press" data-space-id="spc-2">
                    Reserve Desk
                  </button>
                  <button class="chat-nav-map-btn px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold btn-press" data-bld-id="bld-34">
                    Navigate
                  </button>
                </div>
              </div>

              <!-- Place 3: Innovation Lab -->
              <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <h5 class="text-sm font-bold text-slate-900">3. Innovation Lab Co-Workspace</h5>
                    <span class="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Moderate Noise</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>📍 350m (5 min walk)</span>
                    <span>🟢 19 / 32 desks open</span>
                    <span>☕ Espresso bar on site</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button class="chat-reserve-btn px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold btn-press" data-space-id="spc-3">
                    Reserve Desk
                  </button>
                  <button class="chat-nav-map-btn px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold btn-press" data-bld-id="bld-innov">
                    Navigate
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      } 
      // 2. Block 34 / Navigation query
      else if (query.includes("block 34") || query.includes("where is") || query.includes("map") || query.includes("directions")) {
        updateContextPanel("building");
        responseContent = `
          <div class="space-y-4">
            <div class="p-4 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed shadow-2xs">
              <p class="font-bold text-slate-900">Block 34 (Computer Science & Engineering) is 120m North of your location.</p>
              <p class="text-xs text-slate-600 mt-1">Walking time is approximately 2 minutes along the central Science Quad path.</p>
            </div>

            <!-- Structured Location Card -->
            <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Faculty of Computing</span>
                  <h5 class="text-base font-extrabold text-slate-900 mt-0.5">Block 34 — CS & Engineering</h5>
                  <p class="text-xs text-slate-500">Building Code: B-34 • Open until 11:00 PM</p>
                </div>
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Open Now</span>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <span class="font-bold text-slate-900">Key Facilities:</span> Robotics Lab (Rm 101), AI Compute Cluster, Discussion Rooms 1-12, Level 1 Coffee Bar.
              </div>
              <div class="pt-2 flex items-center gap-2">
                <button class="chat-nav-map-btn flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold btn-press flex items-center justify-center gap-2" data-bld-id="bld-34">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                  <span>Plot Route on Interactive Map</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }
      // 3. Lost & Found query
      else if (query.includes("lost") || query.includes("found") || query.includes("bottle") || query.includes("water") || query.includes("hydro") || query.includes("belongings")) {
        updateContextPanel("match");
        responseContent = `
          <div class="space-y-4">
            <div class="p-4 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed shadow-2xs">
              <p class="font-bold text-slate-900">Good news! I matched your report with a 91% confidence score.</p>
              <p class="text-xs text-slate-600 mt-1">A Navy Blue 32oz insulated bottle was turned in at the Student Commons Info Desk.</p>
            </div>

            <!-- Structured AI Match Preview Card -->
            <div class="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-white border border-indigo-200/80 shadow-xs space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span class="text-xs font-bold text-indigo-950 uppercase tracking-wider">AI Multi-Factor Match</span>
                </div>
                <span class="text-xs font-black px-2.5 py-1 rounded-full bg-indigo-600 text-white">91% Match</span>
              </div>

              <div class="flex items-center gap-4">
                <img src="${lostAndFoundItems.activeMatch.foundItem.image}" alt="Bottle" class="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0">
                <div class="text-xs space-y-1">
                  <h6 class="font-bold text-slate-900 text-sm">${lostAndFoundItems.activeMatch.foundItem.name}</h6>
                  <p class="text-slate-500">📍 Turned in at: Student Commons Level 1</p>
                  <p class="text-emerald-700 font-semibold">✓ Verified GitHub Octocat & MIT Hackathon sticker match</p>
                </div>
              </div>

              <div class="pt-2 flex items-center gap-2">
                <button class="chat-open-match-modal-btn flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 btn-press">
                  View Full Side-by-Side Comparison
                </button>
              </div>
            </div>
          </div>
        `;
      }
      // 4. Events query
      else if (query.includes("event") || query.includes("workshop") || query.includes("hackathon") || query.includes("activity") || query.includes("weekend") || query.includes("today")) {
        updateContextPanel("events");
        responseContent = `
          <div class="space-y-4">
            <div class="p-4 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed shadow-2xs">
              <p class="font-bold text-slate-900">Here are top events curated for your profile:</p>
              <p class="text-xs text-slate-600 mt-1">Highlighted based on your interests in AI, Hackathons, and Badminton.</p>
            </div>

            <div class="space-y-3">
              ${campusEvents.slice(0, 2).map(evt => `
                <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-hover">
                  <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-purple-700">${evt.category} • ${evt.date}</span>
                    <h5 class="text-sm font-bold text-slate-900 mt-0.5">${evt.title}</h5>
                    <p class="text-xs text-slate-500">📍 ${evt.location} • ${evt.time}</p>
                  </div>
                  <button class="chat-rsvp-btn px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold btn-press shrink-0" data-event-id="${evt.id}">
                    RSVP
                  </button>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }
      // 5. Default General Intelligence Fallback
      else {
        responseContent = `
          <div class="p-4 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed shadow-2xs">
            <p class="font-bold text-slate-900">I analyzed your request regarding "${escapeHtml(rawQuery)}".</p>
            <p class="mt-1 text-slate-600">
              Campus facilities are currently operating normally. You can ask me to locate buildings on the interactive vector map, check quiet study carrels with live power outlet availability, or check lost item logs.
            </p>
            <div class="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2">
              <button class="chat-prompt-pill px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold" data-prompt="Find available study spaces near me">Find Study Spaces</button>
              <button class="chat-prompt-pill px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold" data-prompt="Where is Block 34?">Locate Block 34</button>
            </div>
          </div>
        `;
      }

      aiMsg.innerHTML = `
        <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-sm shadow-sm shadow-indigo-200">
          ✨
        </div>
        <div class="space-y-3 flex-1">
          ${responseContent}
        </div>
      `;

      container.appendChild(aiMsg);
      scrollToBottom();
      attachChatDynamicListeners();
    }, 600);
  };

  const attachChatDynamicListeners = () => {
    // Navigate buttons
    container.querySelectorAll(".chat-nav-map-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const bldId = btn.dataset.bldId;
        if (onNavigate) onNavigate("campusMap", { selectedBuildingId: bldId });
      });
    });

    // Reserve buttons
    container.querySelectorAll(".chat-reserve-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const spaceId = btn.dataset.spaceId;
        const space = studySpaces.find(s => s.id === spaceId) || studySpaces[0];
        modals.openReserveSpaceModal(space);
      });
    });

    // AI Match Modal Buttons
    container.querySelectorAll(".chat-open-match-modal-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        modals.openMatchResultModal(lostAndFoundItems.activeMatch);
      });
    });

    // Prompt pills
    container.querySelectorAll(".chat-prompt-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const p = pill.dataset.prompt;
        addUserMessage(p);
        processQuery(p);
      });
    });

    // RSVP buttons
    container.querySelectorAll(".chat-rsvp-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        btn.textContent = "✓ RSVP Confirmed";
        btn.classList.remove("bg-slate-900");
        btn.classList.add("bg-emerald-600");
      });
    });
  };

  // Form submit
  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      addUserMessage(val);
      input.value = "";
      processQuery(val);
    });
  }

  // Welcome prompt chips
  document.querySelectorAll(".chat-prompt-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const p = pill.dataset.prompt;
      addUserMessage(p);
      processQuery(p);
    });
  });

  // Context view match button
  const contextMatchBtn = document.getElementById("context-view-match-btn");
  if (contextMatchBtn) {
    contextMatchBtn.addEventListener("click", () => {
      modals.openMatchResultModal(lostAndFoundItems.activeMatch);
    });
  }

  // Reset chat
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (container) {
        container.innerHTML = `
          <div class="flex items-start gap-3.5 max-w-2xl">
            <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-sm shadow-sm shadow-indigo-200">
              ✨
            </div>
            <div class="p-4 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed">
              <p class="font-semibold text-slate-900">Conversation reset.</p>
              <p class="text-xs text-slate-500 mt-1">What campus information or service do you need help with?</p>
            </div>
          </div>
        `;
      }
    });
  }

  // If initialQuery provided, trigger it automatically!
  if (initialQuery) {
    addUserMessage(initialQuery);
    processQuery(initialQuery);
  }
}
