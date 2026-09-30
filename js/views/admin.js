/**
 * UniPulse Admin Console View
 * Campus Operations & Administration Portal
 * Features key performance metrics, SVG Lost & Found weekly activity chart,
 * space capacity distribution, and AI match auditing queue.
 */

import { adminMetrics, lostAndFoundItems } from "../data.js";
import { toasts } from "../components/toasts.js";
import { modals } from "../components/modals.js";

export function renderAdmin() {
  const { 
    activeStudents, 
    lostReportsCount, 
    foundReportsCount, 
    aiMatchResolutionRate, 
    spacesUtilization, 
    activeEventsCount, 
    weeklyReportsTrend,
    spacesOverview,
    pendingVerification
  } = adminMetrics;

  return `
    <div class="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      <!-- Top Admin Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Campus Operations Management System</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Administration Console
          </h2>
          <p class="text-sm md:text-base text-slate-500 mt-1 font-medium">
            Campus-wide intelligence, space capacity optimization, and AI match verification.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button id="admin-export-report-btn" class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold btn-press shadow-2xs">
            Export Audit CSV
          </button>
          <button id="admin-switch-student-btn" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold btn-press shadow-md shadow-indigo-200">
            Exit to Student View
          </button>
        </div>
      </div>

      <!-- Key Metrics Row (6 Core Metrics) -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <!-- 1. Active Students -->
        <div class="p-4 rounded-[20px] bg-white border border-slate-200/80 shadow-xs card-hover">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Students</span>
          <span class="text-2xl font-black text-slate-900 mt-1 block">${activeStudents.toLocaleString()}</span>
          <span class="text-[10px] text-emerald-600 font-bold">↑ 4.2% this week</span>
        </div>

        <!-- 2. Lost Reports -->
        <div class="p-4 rounded-[20px] bg-white border border-slate-200/80 shadow-xs card-hover">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Lost Reports</span>
          <span class="text-2xl font-black text-slate-900 mt-1 block">${lostReportsCount}</span>
          <span class="text-[10px] text-slate-500 font-medium">Total registered</span>
        </div>

        <!-- 3. Found Reports -->
        <div class="p-4 rounded-[20px] bg-white border border-slate-200/80 shadow-xs card-hover">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Found Turn-ins</span>
          <span class="text-2xl font-black text-slate-900 mt-1 block">${foundReportsCount}</span>
          <span class="text-[10px] text-emerald-600 font-bold">90% custody log</span>
        </div>

        <!-- 4. AI Match Rate -->
        <div class="p-4 rounded-[20px] bg-white border border-slate-200/80 shadow-xs card-hover">
          <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">AI Match Rate</span>
          <span class="text-2xl font-black text-indigo-600 mt-1 block">${aiMatchResolutionRate}</span>
          <span class="text-[10px] text-indigo-600 font-bold">Avg 48m match time</span>
        </div>

        <!-- 5. Space Occupancy -->
        <div class="p-4 rounded-[20px] bg-white border border-slate-200/80 shadow-xs card-hover">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Space Capacity</span>
          <span class="text-2xl font-black text-slate-900 mt-1 block">${spacesUtilization}</span>
          <span class="text-[10px] text-amber-600 font-bold">High usage @ Library</span>
        </div>

        <!-- 6. Active Events -->
        <div class="p-4 rounded-[20px] bg-white border border-slate-200/80 shadow-xs card-hover">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Events</span>
          <span class="text-2xl font-black text-slate-900 mt-1 block">${activeEventsCount}</span>
          <span class="text-[10px] text-purple-600 font-bold">4 happening today</span>
        </div>
      </div>

      <!-- Two-Column Layout: Charts & Space Overviews -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2 Cols: Lost & Found Weekly Activity Chart (SVG) -->
        <div class="lg:col-span-2 p-6 md:p-8 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-extrabold text-slate-900">Lost & Found Resolution Velocity</h3>
              <p class="text-xs text-slate-500">Weekly comparison: Lost reports vs. Found turn-ins vs. AI matched pairs</p>
            </div>
            <!-- Legend -->
            <div class="flex items-center gap-4 text-xs font-semibold">
              <span class="flex items-center gap-1.5 text-indigo-600">
                <span class="w-3 h-3 rounded bg-indigo-600"></span> AI Matched
              </span>
              <span class="flex items-center gap-1.5 text-slate-400">
                <span class="w-3 h-3 rounded bg-slate-300"></span> Lost Reports
              </span>
            </div>
          </div>

          <!-- Interactive SVG Bar Chart -->
          <div class="w-full h-64 relative flex items-end justify-between pt-8 pb-6 px-4 bg-slate-50/60 rounded-2xl border border-slate-100">
            ${weeklyReportsTrend.map(item => {
              const lostHeight = (item.lost / 35) * 160;
              const matchedHeight = (item.matched / 35) * 160;
              return `
                <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                  <div class="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${item.matched} matched
                  </div>
                  <div class="flex items-end gap-1.5">
                    <!-- Lost bar -->
                    <div class="w-3.5 bg-slate-300 rounded-t-sm transition-all duration-300 group-hover:bg-slate-400" style="height: ${lostHeight}px" title="${item.lost} lost"></div>
                    <!-- Matched bar -->
                    <div class="w-3.5 bg-indigo-600 rounded-t-sm transition-all duration-300 group-hover:bg-indigo-700" style="height: ${matchedHeight}px" title="${item.matched} matched"></div>
                  </div>
                  <span class="text-xs font-bold text-slate-600 mt-1">${item.day}</span>
                </div>
              `;
            }).join("")}
          </div>

          <div class="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
            <span class="font-medium">✨ AI multi-factor matching has cut average student claim turnaround from 4.8 days to 42 minutes.</span>
            <span class="font-bold text-indigo-700">94.2% verified accuracy</span>
          </div>
        </div>

        <!-- Right 1 Col: Space Capacity Overview by Sector -->
        <div class="p-6 md:p-8 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 class="text-base font-extrabold text-slate-900">Live Space Utilization</h3>
            <p class="text-xs text-slate-500">Real-time occupancy across academic zones</p>
          </div>

          <div class="space-y-4">
            ${spacesOverview.map(s => `
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs font-semibold">
                  <span class="text-slate-800">${s.zone}</span>
                  <span class="${s.pct > 75 ? "text-amber-600" : "text-slate-500"}">${s.occupied} / ${s.totalDesks} (${s.pct}%)</span>
                </div>
                <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full ${
                    s.pct > 75 ? "bg-amber-500" : s.pct > 60 ? "bg-indigo-600" : "bg-emerald-500"
                  }" style="width: ${s.pct}%"></div>
                </div>
              </div>
            `).join("")}
          </div>

          <div class="pt-4 border-t border-slate-100">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Automated Load Balancing</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              When the Main Library exceeds 80% occupancy, the UniPulse AI Assistant automatically redirects student study queries to Block 34 discussion rooms and Innovation Lab co-workspaces.
            </p>
          </div>
        </div>

      </div>

      <!-- Bottom Queue: AI Match Verification Audit Table -->
      <div class="p-6 md:p-8 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-extrabold text-slate-900">AI Match Review & Audit Queue</h3>
            <p class="text-xs text-slate-500">Staff verification required before releasing items to claimants</p>
          </div>
          <span class="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
            2 Pending Verification
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th class="py-3 px-4">Item Name</th>
                <th class="py-3 px-4">Lost By</th>
                <th class="py-3 px-4">Turned in By</th>
                <th class="py-3 px-4">Location</th>
                <th class="py-3 px-4">AI Confidence</th>
                <th class="py-3 px-4">Timestamp</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              ${pendingVerification.map(item => `
                <tr class="hover:bg-slate-50/80 transition-colors">
                  <td class="py-3.5 px-4 font-bold text-slate-900">${item.item}</td>
                  <td class="py-3.5 px-4">${item.lostUser}</td>
                  <td class="py-3.5 px-4">${item.foundBy}</td>
                  <td class="py-3.5 px-4">${item.location}</td>
                  <td class="py-3.5 px-4">
                    <span class="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                      ${item.score}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-slate-400">${item.time}</td>
                  <td class="py-3.5 px-4 text-right">
                    <button class="approve-match-btn px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors btn-press mr-2" data-id="${item.id}">
                      Approve Match
                    </button>
                    <button class="admin-inspect-btn px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition-colors btn-press">
                      Audit
                    </button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

export function initAdminListeners(onNavigate) {
  // Exit to student view
  const switchBtn = document.getElementById("admin-switch-student-btn");
  if (switchBtn && onNavigate) {
    switchBtn.addEventListener("click", () => {
      onNavigate("dashboard", { isAdminMode: false });
    });
  }

  // Export CSV
  const exportBtn = document.getElementById("admin-export-report-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      toasts.show({
        title: "Export Generated",
        message: "unipulse-campus-audit-report.csv has been downloaded.",
        type: "success"
      });
    });
  }

  // Approve Match in table
  document.querySelectorAll(".approve-match-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.textContent = "✓ Verified";
      btn.classList.remove("bg-indigo-600");
      btn.classList.add("bg-emerald-600");
      toasts.show({
        title: "Claim Approved",
        message: "Student notified with pickup clearance QR token.",
        type: "success"
      });
    });
  });

  // Audit button
  document.querySelectorAll(".admin-inspect-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      modals.openMatchResultModal(lostAndFoundItems.activeMatch);
    });
  });
}
