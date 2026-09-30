/**
 * UniPulse Toast Notification System
 * Includes Web Audio API micro-chimes for feedback and sleek animated toasts.
 */

class ToastManager {
  constructor() {
    this.container = null;
    this.audioCtx = null;
    this.init();
  }

  init() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.className = "fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full";
      document.body.appendChild(this.container);
    }
  }

  playChime(type = "info") {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (!this.audioCtx || this.audioCtx.state === "suspended") {
        this.audioCtx?.resume();
      }
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      if (type === "success" || type === "match") {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      } else if (type === "warning") {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.15);
      } else {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      }

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      // Audio playback fails gracefully if browser blocks autoplay
    }
  }

  show({ title, message, type = "info", duration = 4000, icon = null }) {
    this.init();
    this.playChime(type);

    const toast = document.createElement("div");
    toast.className = `pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white/95 backdrop-blur-md border shadow-lg transition-all duration-300 transform translate-y-3 opacity-0 ${
      type === "match"
        ? "border-indigo-200 bg-indigo-50/90 text-indigo-950"
        : type === "success"
        ? "border-emerald-200 text-slate-900"
        : type === "warning"
        ? "border-amber-200 text-slate-900"
        : "border-slate-200 text-slate-900"
    }`;

    // Icon SVGs
    let iconSvg = "";
    if (type === "match") {
      iconSvg = `<div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-300">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>`;
    } else if (type === "success") {
      iconSvg = `<div class="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      </div>`;
    } else if (type === "warning") {
      iconSvg = `<div class="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      </div>`;
    } else {
      iconSvg = `<div class="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-semibold tracking-tight text-slate-900">${title}</h4>
        ${message ? `<p class="text-xs text-slate-600 mt-0.5 leading-relaxed">${message}</p>` : ""}
      </div>
      <button class="text-slate-400 hover:text-slate-700 p-1 -mr-1 rounded-lg transition-colors" onclick="this.parentElement.remove()">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    `;

    this.container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-3", "opacity-0");
      toast.classList.add("translate-y-0", "opacity-100");
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

export const toasts = new ToastManager();
