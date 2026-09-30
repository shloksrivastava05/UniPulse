/**
 * UniPulse Modals & Interactive Overlays
 * Includes Report Lost/Found, 91% AI Match Reveal, Space Reservation, and Cmd+K Search.
 */

import { toasts } from "./toasts.js";
import { lostAndFoundItems, studySpaces, campusBuildings, campusEvents, mockUser, escapeHtml } from "../data.js";

class ModalManager {
  constructor() {
    this.overlay = null;
    this.contentContainer = null;
    this.init();
  }

  init() {
    if (!this.overlay) {
      this.overlay = document.createElement("div");
      this.overlay.id = "modal-overlay";
      this.overlay.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 opacity-0 pointer-events-none transition-opacity duration-200";
      
      this.contentContainer = document.createElement("div");
      this.contentContainer.className = "relative w-full max-h-[90vh] overflow-y-auto bg-white rounded-[24px] shadow-2xl border border-slate-100 transition-all duration-300 transform scale-95 opacity-0";
      
      this.overlay.appendChild(this.contentContainer);
      document.body.appendChild(this.overlay);

      // Close on overlay click
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });

      // Close on Escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen()) {
          this.close();
        }
      });
    }
  }

  isOpen() {
    return this.overlay && !this.overlay.classList.contains("pointer-events-none");
  }

  show(contentHtml, maxWidth = "max-w-2xl") {
    this.init();
    this.contentContainer.className = `relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto bg-white rounded-[24px] shadow-2xl border border-slate-100 transition-all duration-200 transform scale-95 opacity-0`;
    this.contentContainer.innerHTML = contentHtml;

    // Apply the backdrop blur instantly (a single static paint), never
    // animated — see the note in close() for why.
    this.overlay.classList.add("backdrop-blur-sm");
    this.overlay.classList.remove("pointer-events-none");
    this.overlay.classList.remove("opacity-0");
    this.overlay.classList.add("opacity-100");

    requestAnimationFrame(() => {
      this.contentContainer.classList.remove("scale-95", "opacity-0");
      this.contentContainer.classList.add("scale-100", "opacity-100");
    });
  }

  close() {
    if (!this.overlay) return;
    // Drop the expensive full-screen backdrop-blur immediately/unanimated.
    // Fading `opacity` on an element that also carries `backdrop-filter:
    // blur()` forces the browser to recompute that blur on every single
    // frame of the fade over everything behind it — on a busy page (or a
    // slower GPU, or while screen-recording) that repaint can stall for
    // seconds instead of the intended 200ms, which is exactly the "stuck
    // blurry until I refresh" symptom. Removing the blur class up front
    // means the fade that follows only ever animates cheap opacity/scale.
    this.overlay.classList.remove("backdrop-blur-sm");
    this.overlay.classList.add("opacity-0");
    this.overlay.classList.add("pointer-events-none");
    this.contentContainer.classList.remove("scale-100", "opacity-100");
    this.contentContainer.classList.add("scale-95", "opacity-0");
    setTimeout(() => {
      this.contentContainer.innerHTML = "";
    }, 200);
  }

  // --- 1. Report Lost Item Modal ---
  openLostReportModal() {
    const html = `
      <div class="p-6 md:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <div>
              <h3 class="text-xl font-bold tracking-tight text-slate-900">Report a Lost Item</h3>
              <p class="text-xs text-slate-500">UniPulse AI will immediately scan recent turn-ins across campus.</p>
            </div>
          </div>
          <button class="modal-close-btn p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form id="lost-report-form" class="mt-6 space-y-5">
          <!-- Drag and Drop Image Upload Area -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Item Photo (Optional but improves AI matching by 80%)</label>
            <div id="dropzone" class="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200">
              <input type="file" id="file-input" class="hidden" accept="image/*">
              <div id="dropzone-content">
                <div class="w-12 h-12 mx-auto rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600 mb-3">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <p class="text-sm font-semibold text-slate-800">Drop an image here, or <span class="text-indigo-600 underline">browse files</span></p>
                <p class="text-xs text-slate-400 mt-1">Supports PNG, JPG, HEIC up to 10MB</p>
              </div>
              <div id="image-preview" class="hidden flex items-center justify-center gap-4">
                <img src="" id="preview-img" class="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm" alt="Preview">
                <div class="text-left">
                  <p id="file-name" class="text-sm font-semibold text-slate-800 truncate max-w-xs">image.jpg</p>
                  <p class="text-xs text-emerald-600 font-medium">✓ Image ready for visual analysis</p>
                  <button type="button" id="remove-img-btn" class="text-xs text-rose-500 hover:underline mt-1">Remove photo</button>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Item Name *</label>
              <input type="text" id="item-name" required placeholder="e.g. Navy Blue Hydro Flask (32oz)" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Category *</label>
              <select id="item-category" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm bg-white">
                <option value="Drinkware">Drinkware / Water Bottles</option>
                <option value="Electronics">Electronics & Audio (AirPods, Laptops)</option>
                <option value="Personal Accessories">Wallets, Keys & Bags</option>
                <option value="ID Cards">Student Cards & IDs</option>
                <option value="Academic Equipment">Calculators, Textbooks, Notes</option>
                <option value="Clothing">Clothing & Eyewear</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Last Seen Location *</label>
              <select id="item-location" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm bg-white">
                <option value="Student Commons, Level 2 Lounge">Student Commons (Level 2 Lounge)</option>
                <option value="Block 34, Discussion Rooms">Block 34 (CS & Engineering)</option>
                <option value="Main Library, Silent Zone">Main Library (Level 3 or 4)</option>
                <option value="Innovation Lab Co-Workspace">Innovation Lab</option>
                <option value="Sports Complex">Sports Complex & Gym</option>
                <option value="Science Quad Lawns">Science Quad Lawns</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Approximate Time *</label>
              <input type="text" id="item-time" placeholder="e.g. Today around 1:00 PM" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm">
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Unique Identifiers / Stickers / Markings</label>
            <textarea id="item-desc" rows="3" placeholder="Describe specific scratches, stickers, engravings, serial digits, or case colors..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm"></textarea>
          </div>

          <!-- Submit Action -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" class="modal-close-btn px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 btn-press">
              Cancel
            </button>
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 btn-press flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>Submit & Run AI Matcher</span>
            </button>
          </div>
        </form>
      </div>
    `;

    this.show(html, "max-w-2xl");
    this.attachFormListeners("lost");
  }

  // --- 2. Report Found Item Modal ---
  openFoundReportModal() {
    const html = `
      <div class="p-6 md:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div>
              <h3 class="text-xl font-bold tracking-tight text-slate-900">Report a Found Item</h3>
              <p class="text-xs text-slate-500">Help a fellow student! We securely verify claims before releasing items.</p>
            </div>
          </div>
          <button class="modal-close-btn p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form id="found-report-form" class="mt-6 space-y-5">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Item Photo (Recommended)</label>
            <div id="dropzone" class="border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200">
              <input type="file" id="file-input" class="hidden" accept="image/*">
              <div id="dropzone-content">
                <div class="w-12 h-12 mx-auto rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-emerald-600 mb-3">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <p class="text-sm font-semibold text-slate-800">Drop an image here, or <span class="text-emerald-600 underline">browse files</span></p>
                <p class="text-xs text-slate-400 mt-1">Supports PNG, JPG, HEIC up to 10MB</p>
              </div>
              <div id="image-preview" class="hidden flex items-center justify-center gap-4">
                <img src="" id="preview-img" class="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm" alt="Preview">
                <div class="text-left">
                  <p id="file-name" class="text-sm font-semibold text-slate-800 truncate max-w-xs">found-item.jpg</p>
                  <p class="text-xs text-emerald-600 font-medium">✓ Photo attached</p>
                  <button type="button" id="remove-img-btn" class="text-xs text-rose-500 hover:underline mt-1">Remove photo</button>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">What did you find? *</label>
              <input type="text" id="item-name" required placeholder="e.g. Dark Blue Insulated Flask" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Category *</label>
              <select id="item-category" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm bg-white">
                <option value="Drinkware">Drinkware / Water Bottles</option>
                <option value="Electronics">Electronics & Audio</option>
                <option value="Personal Accessories">Wallets, Keys & Bags</option>
                <option value="ID Cards">Student Cards & IDs</option>
                <option value="Academic Equipment">Calculators, Textbooks</option>
                <option value="Clothing">Clothing & Eyewear</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Location Found *</label>
              <input type="text" id="item-location" required placeholder="e.g. Student Commons Couch Lounge" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Current Custody / Turn-in Desk *</label>
              <select id="item-custody" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm bg-white">
                <option value="Student Commons Info Desk">Student Commons Level 1 Info Desk</option>
                <option value="Block 34 Security Desk">Block 34 1st Floor Security</option>
                <option value="Library Circulation Desk">Library Circulation Counter</option>
                <option value="With me (Direct contact)">Keeping with me safely</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Item Description</label>
            <textarea id="item-desc" rows="3" placeholder="Describe color, visible stickers, condition..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm"></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" class="modal-close-btn px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 btn-press">
              Cancel
            </button>
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-200 btn-press flex items-center gap-2">
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    `;

    this.show(html, "max-w-2xl");
    this.attachFormListeners("found");
  }

  attachFormListeners(type) {
    const closeBtns = this.contentContainer.querySelectorAll(".modal-close-btn");
    closeBtns.forEach(btn => btn.addEventListener("click", () => this.close()));

    // Dropzone logic
    const dropzone = this.contentContainer.querySelector("#dropzone");
    const fileInput = this.contentContainer.querySelector("#file-input");
    const dropzoneContent = this.contentContainer.querySelector("#dropzone-content");
    const imagePreview = this.contentContainer.querySelector("#image-preview");
    const previewImg = this.contentContainer.querySelector("#preview-img");
    const fileName = this.contentContainer.querySelector("#file-name");
    const removeImgBtn = this.contentContainer.querySelector("#remove-img-btn");

    if (dropzone && fileInput) {
      dropzone.addEventListener("click", (e) => {
        if (e.target !== removeImgBtn) {
          fileInput.click();
        }
      });

      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            previewImg.src = re.target.result;
            fileName.textContent = file.name;
            dropzoneContent.classList.add("hidden");
            imagePreview.classList.remove("hidden");
          };
          reader.readAsDataURL(file);
        }
      });

      if (removeImgBtn) {
        removeImgBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          fileInput.value = "";
          previewImg.src = "";
          dropzoneContent.classList.remove("hidden");
          imagePreview.classList.add("hidden");
        });
      }
    }

    const form = this.contentContainer.querySelector(type === "lost" ? "#lost-report-form" : "#found-report-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const itemName = form.querySelector("#item-name").value;
        this.close();

        toasts.show({
          title: type === "lost" ? "Lost Report Registered" : "Found Report Submitted",
          message: `"${itemName}" has been indexed. AI multi-factor scanning active.`,
          type: "success"
        });

        // Trigger AI Match Simulation after short delay if reporting lost bottle
        if (type === "lost") {
          setTimeout(() => {
            toasts.show({
              title: "AI Match Detected (91%)!",
              message: `A matching ${itemName} was located at Student Commons! Click to view side-by-side analysis.`,
              type: "match",
              duration: 7000
            });
          }, 1800);
        }
      });
    }
  }

  // --- 3. AI Match Result Modal (The Flagship 91% Match View) ---
  openMatchResultModal(matchData = lostAndFoundItems.activeMatch) {
    const { matchScore, lostItem, foundItem, matchFactors } = matchData;

    const html = `
      <div class="p-6 md:p-8">
        <!-- Header with Confidence Pill -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Verified Match
                </span>
                <span class="text-xs text-slate-400 font-medium">Ref #AIM-8891</span>
              </div>
              <h3 class="text-2xl font-black tracking-tight text-slate-900 mt-1">Possible Match Found</h3>
            </div>
          </div>
          
          <!-- Visual Circular Confidence Indicator -->
          <div class="flex items-center gap-3 bg-indigo-50/80 border border-indigo-100 px-4 py-2 rounded-2xl">
            <div class="relative w-12 h-12 flex items-center justify-center">
              <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-indigo-200" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="text-indigo-600 match-circle" stroke-dasharray="100, 100" stroke-dashoffset="9" stroke-linecap="round" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span class="absolute text-xs font-black text-indigo-900">${matchScore}%</span>
            </div>
            <div class="text-left">
              <p class="text-xs font-bold text-indigo-950">High Confidence</p>
              <p class="text-[11px] text-indigo-600 font-medium">Computer Vision & Time</p>
            </div>
          </div>
        </div>

        <!-- Side-by-Side Comparison -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Lost Item Card -->
          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                Your Lost Report
              </span>
              <span class="text-xs text-slate-500 font-medium">${lostItem.time}</span>
            </div>
            <div class="h-44 rounded-xl overflow-hidden mb-3 bg-slate-200 border border-slate-200 relative">
              <img src="${lostItem.image}" alt="${lostItem.name}" class="w-full h-full object-cover">
              <div class="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[11px] font-medium">
                Reported by ${lostItem.reportedBy}
              </div>
            </div>
            <h4 class="font-bold text-slate-900 text-base leading-snug">${lostItem.name}</h4>
            <p class="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">${lostItem.description}</p>
            <div class="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span>📍 ${lostItem.location}</span>
              <span class="font-medium text-slate-700">${lostItem.category}</span>
            </div>
          </div>

          <!-- Found Item Card -->
          <div class="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-200/80 relative">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Turned In Item
              </span>
              <span class="text-xs text-slate-500 font-medium">${foundItem.time}</span>
            </div>
            <div class="h-44 rounded-xl overflow-hidden mb-3 bg-slate-200 border border-slate-200 relative">
              <img src="${foundItem.image}" alt="${foundItem.name}" class="w-full h-full object-cover">
              <div class="absolute bottom-2 left-2 bg-indigo-950/80 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[11px] font-medium">
                Custody: ${foundItem.reportedBy}
              </div>
            </div>
            <h4 class="font-bold text-slate-900 text-base leading-snug">${foundItem.name}</h4>
            <p class="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">${foundItem.description}</p>
            <div class="mt-3 pt-3 border-t border-indigo-100 flex items-center justify-between text-xs text-slate-500">
              <span>📍 ${foundItem.location}</span>
              <span class="font-medium text-slate-700">${foundItem.category}</span>
            </div>
          </div>
        </div>

        <!-- Explainable Match Factors Checklist -->
        <div class="mt-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h5 class="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Explainable AI Match Factors
          </h5>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${matchFactors.map(factor => `
              <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-900">${factor.factor}</p>
                  <p class="text-[11px] text-slate-500 leading-tight mt-0.5">${factor.detail}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Pickup & Claim Info (Privacy Preserving) -->
        <div class="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold">
            i
          </div>
          <div class="flex-1 text-xs">
            <span class="font-bold text-amber-950">Pickup Location:</span>
            <span class="text-amber-900">${foundItem.itemPickupLocation}</span>
            <p class="text-amber-800 text-[11px] mt-0.5">Student privacy guaranteed. Show your student card at the desk to verify sticker markings.</p>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button class="modal-close-btn w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 btn-press">
            Dismiss
          </button>
          <button id="view-found-report-btn" class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/50 text-sm font-semibold btn-press">
            View Found Report
          </button>
          <button id="claim-item-btn" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 btn-press flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span>Contact Desk & Claim</span>
          </button>
        </div>
      </div>
    `;

    this.show(html, "max-w-3xl");

    const closeBtns = this.contentContainer.querySelectorAll(".modal-close-btn");
    closeBtns.forEach(btn => btn.addEventListener("click", () => this.close()));

    const viewReportBtn = this.contentContainer.querySelector("#view-found-report-btn");
    if (viewReportBtn) {
      viewReportBtn.addEventListener("click", () => {
        toasts.show({
          title: "Official Log #LF-992",
          message: "Turned into Student Commons Lost & Found desk at 2:00 PM. Verified by Staff.",
          type: "info"
        });
      });
    }

    const claimBtn = this.contentContainer.querySelector("#claim-item-btn");
    if (claimBtn) {
      claimBtn.addEventListener("click", () => {
        this.openContactClaimModal(foundItem);
      });
    }
  }

  // --- 4. Secure Claim Modal ---
  openContactClaimModal(foundItem) {
    const html = `
      <div class="p-6 md:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div>
              <h3 class="text-xl font-bold tracking-tight text-slate-900">Secure Ownership Claim</h3>
              <p class="text-xs text-slate-500">Contacting Student Commons Lost & Found Terminal</p>
            </div>
          </div>
          <button class="modal-close-btn p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="mt-6 space-y-4 text-sm text-slate-700">
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p class="font-semibold text-slate-900">Desk Reference:</p>
            <p class="text-xs text-slate-600 mt-0.5">Item Ref: #LF-992 (${foundItem.name})</p>
            <p class="text-xs text-slate-600">Location: ${foundItem.itemPickupLocation}</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Verification Note for Staff</label>
            <textarea id="claim-note" rows="3" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm" placeholder="Provide any additional detail to match your claim (e.g. 'I will arrive at 3:30 PM with student ID STU-88291')"></textarea>
          </div>

          <div class="flex items-center gap-2 text-xs text-slate-500">
            <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span>Your student identity (Shlok Srivastava) will be presented to campus security on arrival.</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button class="modal-close-btn px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 btn-press">
            Cancel
          </button>
          <button id="send-claim-btn" class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 btn-press">
            Dispatch Claim to Desk
          </button>
        </div>
      </div>
    `;

    this.show(html, "max-w-md");
    const closeBtns = this.contentContainer.querySelectorAll(".modal-close-btn");
    closeBtns.forEach(btn => btn.addEventListener("click", () => this.close()));

    const sendBtn = this.contentContainer.querySelector("#send-claim-btn");
    if (sendBtn) {
      sendBtn.addEventListener("click", () => {
        this.close();
        toasts.show({
          title: "Claim Dispatched",
          message: "Campus desk notified. Pickup pass generated for Student Commons Info Desk.",
          type: "success"
        });
      });
    }
  }

  // --- 5. Quick Reserve Space Modal ---
  openReserveSpaceModal(space) {
    const html = `
      <div class="p-6 md:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <div>
              <h3 class="text-xl font-bold tracking-tight text-slate-900">Reserve Study Desk</h3>
              <p class="text-xs text-slate-500">${space.buildingName} • ${space.floor}</p>
            </div>
          </div>
          <button class="modal-close-btn p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="mt-5 space-y-4">
          <div class="h-36 rounded-2xl overflow-hidden relative">
            <img src="${space.image}" alt="${space.name}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-4">
              <div>
                <p class="text-white font-bold text-base">${space.name}</p>
                <p class="text-xs text-slate-200">Current Availability: ${space.availableDesks} of ${space.capacity} open desks</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block font-medium">Noise Atmosphere</span>
              <span class="font-bold text-slate-800 text-sm mt-0.5 block">${space.noiseLevel}</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block font-medium">Walking Distance</span>
              <span class="font-bold text-slate-800 text-sm mt-0.5 block">${space.distance} (${space.walkTime})</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Select Duration</label>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" class="duration-pill py-2 text-xs font-bold rounded-xl border border-indigo-600 bg-indigo-50 text-indigo-700">45 Minutes</button>
              <button type="button" class="duration-pill py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700">2 Hours</button>
              <button type="button" class="duration-pill py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700">4 Hours</button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button class="modal-close-btn px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 btn-press">
            Cancel
          </button>
          <button id="confirm-reserve-btn" class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 btn-press">
            Confirm Instant Desk Pass
          </button>
        </div>
      </div>
    `;

    this.show(html, "max-w-md");
    const closeBtns = this.contentContainer.querySelectorAll(".modal-close-btn");
    closeBtns.forEach(btn => btn.addEventListener("click", () => this.close()));

    const confirmBtn = this.contentContainer.querySelector("#confirm-reserve-btn");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        this.close();
        toasts.show({
          title: "Study Desk Reserved!",
          message: `Your pass for ${space.name} is confirmed for the next 45 minutes.`,
          type: "success"
        });
      });
    }
  }

  // --- 6. Global Cmd+K Search Palette ---
  openCommandPalette(onSelectCallback) {
    const html = `
      <div class="p-4 md:p-6">
        <div class="relative flex items-center border-b border-slate-100 pb-3">
          <svg class="w-5 h-5 text-slate-400 absolute left-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" id="palette-search-input" autofocus placeholder="Search campus places, events, study spaces, lost items..." class="w-full pl-11 pr-4 py-2.5 text-base font-medium text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none">
          <span class="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">ESC to exit</span>
        </div>

        <div id="palette-results" class="mt-4 max-h-80 overflow-y-auto space-y-1">
          <!-- Dynamic results populated here -->
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 px-2">
          <span>Navigate with arrows or click</span>
          <span class="flex items-center gap-1">UniPulse Smart Index • 14,800 records</span>
        </div>
      </div>
    `;

    this.show(html, "max-w-xl");
    const input = this.contentContainer.querySelector("#palette-search-input");
    const resultsContainer = this.contentContainer.querySelector("#palette-results");

    const renderResults = (query = "") => {
      const q = query.toLowerCase().trim();
      let resultsHtml = "";

      // Quick Actions
      if (!q) {
        resultsHtml += `
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">Quick Suggestions</div>
          <div class="palette-item flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors" data-type="route" data-target="assistant" data-query="study">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">✨</div>
            <div>
              <p class="text-sm font-semibold text-slate-900">Ask AI: Find a quiet place to study right now</p>
              <p class="text-xs text-slate-400">Conversational campus assistant</p>
            </div>
          </div>
          <div class="palette-item flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors" data-type="route" data-target="campusMap" data-building="bld-34">
            <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">📍</div>
            <div>
              <p class="text-sm font-semibold text-slate-900">Block 34 — Computer Science & Eng.</p>
              <p class="text-xs text-slate-400">120m away • 2 min walk</p>
            </div>
          </div>
          <div class="palette-item flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors" data-type="match" data-target="lostFound">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">🔍</div>
            <div>
              <p class="text-sm font-semibold text-slate-900">AI Match: Navy Blue Hydro Flask (91% Match)</p>
              <p class="text-xs text-indigo-600 font-medium">Found at Student Commons</p>
            </div>
          </div>
        `;
      } else {
        // Filter buildings
        campusBuildings.filter(b => b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)).forEach(b => {
          resultsHtml += `
            <div class="palette-item flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors" data-type="route" data-target="campusMap" data-building="${b.id}">
              <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">MAP</div>
              <div>
                <p class="text-sm font-semibold text-slate-900">${b.name}</p>
                <p class="text-xs text-slate-400">${b.category} • ${b.distance} away</p>
              </div>
            </div>
          `;
        });

        // Filter study spaces
        studySpaces.filter(s => s.name.toLowerCase().includes(q) || s.suitableFor.toLowerCase().includes(q)).forEach(s => {
          resultsHtml += `
            <div class="palette-item flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors" data-type="route" data-target="spaces">
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">DESK</div>
              <div>
                <p class="text-sm font-semibold text-slate-900">${s.name}</p>
                <p class="text-xs text-slate-400">${s.availableDesks} of ${s.capacity} desks open • ${s.noiseLevel}</p>
              </div>
            </div>
          `;
        });

        // Filter events
        campusEvents.filter(e => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)).forEach(e => {
          resultsHtml += `
            <div class="palette-item flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors" data-type="route" data-target="events">
              <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">EVT</div>
              <div>
                <p class="text-sm font-semibold text-slate-900">${e.title}</p>
                <p class="text-xs text-slate-400">${e.date} • ${e.location}</p>
              </div>
            </div>
          `;
        });

        if (!resultsHtml) {
          resultsHtml = `
            <div class="text-center py-8 text-slate-400 text-sm">
              No direct matches found for "${escapeHtml(query)}". Try asking the AI Assistant!
            </div>
          `;
        }
      }

      resultsContainer.innerHTML = resultsHtml;

      // Attach click listeners to result items
      resultsContainer.querySelectorAll(".palette-item").forEach(item => {
        item.addEventListener("click", () => {
          const target = item.dataset.target;
          const type = item.dataset.type;
          const building = item.dataset.building;
          this.close();
          if (onSelectCallback) {
            onSelectCallback({ target, type, building });
          }
        });
      });
    };

    renderResults();
    input.addEventListener("input", (e) => renderResults(e.target.value));
    setTimeout(() => input.focus(), 50);
  }
}

export const modals = new ModalManager();
