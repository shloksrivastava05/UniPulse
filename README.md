# UniPulse — AI-Powered Smart Campus Platform

> **"Find. Report. Discover."**  
> *A high-fidelity, production-quality SaaS web application bringing campus services and university life into one intelligent interface.*

---

## 🌟 Executive Overview

UniPulse replaces fragmented university portals with an intelligent, cohesive, modern interface designed specifically for students and campus administration. Built with a clean, warm-neutral design system, subtle elevation, responsive layouts, and zero external build dependencies.

### Core Capabilities:
1. **Conversational Campus Assistant:** Context-aware natural language AI capable of resolving schedule, location, study, and lost belongings queries with structured responses and dynamic context sidecards.
2. **Interactive Campus Finder:** Vector SVG campus map with animated pedestrian walking routes, facility directory, building hours, and category filters.
3. **Smart Lost & Found:** High-precision computer vision matching with side-by-side comparison, **91% Match confidence score**, explainable match factors, drag-and-drop report intake, and privacy-preserving claim workflows.
4. **Live Study Spaces:** Real-time seat availability gauges, noise atmosphere indicators (Silent Focus, Quiet, Moderate, Collaborative), power outlet filters, and instant desk reservation passes.
5. **Campus Events & Hackathons:** Personalized event recommendations based on academic profile ("Recommended because you follow AI & Coding"), live RSVP status, and bookmarking.
6. **Student Profile:** Academic credentials (B.S. Computer Science '27), customizable interest tags, report resolution timeline, and notification toggles.
7. **Administration Console:** High-level metrics (14,820 active students, 94.2% AI match rate), Lost & Found resolution velocity charts, space capacity distribution, and staff match audit queue.

---

## 🚀 Quick Launch Instructions

UniPulse is completely standalone and requires **no Node.js, npm, or compilation**. It runs natively using Python 3 or direct browser launch:

### Option 1: Local HTTP Server (Recommended)
```bash
cd UniPulse
python3 server.py 8080
```
Open your browser at: **[http://localhost:8080](http://localhost:8080)**

### Option 2: Direct Browser Launch
You can double-click `index.html` or run:
```bash
open UniPulse/index.html
```

---

## 🎨 Design System Specifications

- **Background:** Warm off-white (`#F8F9FA` / `#F9FAFB`)
- **Cards:** Pure white (`#FFFFFF`) with 20px border-radius (`rounded-[20px]`) and soft diffused elevation.
- **Typography:** Plus Jakarta Sans & Inter font stack with strong visual hierarchy.
- **Primary Accent:** Sophisticated Electric Blurple / Indigo (`#4F46E5` / `#6366F1`) with subtle gradients and soft indigo glows.
- **Micro-Interactions:** Active button depressions (`active:scale-[0.97]`), live AI typing indicators, interactive SVG map route lines, and Web Audio API subtle feedback chimes.
- **Keyboard Shortcuts:** `Cmd+K` / `Ctrl+K` opens the Global Command Palette from anywhere in the app; `ESC` dismisses active overlays.

---

## 📂 File Architecture

```
unipulse/
├── index.html              # Clean single-page application shell
├── server.py               # Lightweight Python 3 HTTP server with CORS & MIME types
├── build_bundle.py         # Standalone bundler script ensuring zero-friction execution
├── README.md               # Documentation & product walkthrough
├── css/
│   └── custom.css          # Glassmorphism, animations, scrollbars, and route keyframes
└── js/
    ├── app.js              # Application router, state store, keyboard shortcut listener
    ├── bundle.js           # Production standalone bundle
    ├── data.js             # Rich university mock data (buildings, spaces, events, lost items, profile)
    ├── components/
    │   ├── header.js       # Global header, search trigger, location beacon, notifications flyout
    │   ├── sidebar.js      # Responsive navigation, role toggle, user profile card
    │   ├── modals.js       # Lost/Found intake modals, 91% Match reveal, space reservation
    │   └── toasts.js       # Toast manager with Web Audio API chime synthesis
    └── views/
        ├── dashboard.js    # Student greeting, rotating AI hero search, campus snapshot
        ├── assistant.js    # Conversational chat with structured bubbles & right context panel
        ├── campusMap.js    # Vector SVG interactive map with walking route polyline
        ├── lostFound.js    # Flagship Lost & Found hub, dual CTAs, side-by-side match viewer
        ├── spaces.js       # Live occupancy progress bars, noise filters, desk reservation
        ├── events.js       # Curated "For You" event cards, category filters, RSVP
        ├── profile.js      # Student credentials, editable interests, report timeline
        └── admin.js        # Operations metrics, activity chart, space overview, audit table
```

---

## 🧪 Interactive Showcase Guide

1. **Dashboard:**
   - Watch the hero input rotate through intelligent sample queries every 3 seconds.
   - Click any suggestion chip (e.g. *"40 mins free: where to study quietly?"*) to jump directly into conversational AI.
   - Click **"View 91% AI Match"** on the hero banner to see the flagship multi-factor comparison screen.
2. **AI Campus Assistant:**
   - Type custom questions or click suggested prompt chips.
   - Notice the typing indicator, structured multi-card response (with walk times, noise levels, open desk counts), and the **Right Context Panel** dynamically syncing with the conversation.
3. **Lost & Found:**
   - Click **"I Lost Something"** or **"I Found Something"** to open the drag-and-drop upload modal with image preview and category taxonomy.
   - Click **"View Side-by-Side Analysis"** to inspect the 91% match, circular confidence indicator, explainable factor checklist, and contact the campus desk.
4. **Campus Finder:**
   - Click on any building in the directory (e.g. *Block 34*, *Main Library*, *Sports Complex*) or directly on the SVG map nodes.
   - Observe the map highlight and the animated dashed walking route polyline calculating distance and transit time.
5. **Live Study Spaces:**
   - Filter by noise level (*Silent Focus*, *Moderate*, *Collaborative*).
   - Click **"Reserve Desk"** to issue a 45-minute desk pass with audio chime confirmation.
6. **Events Discovery:**
   - Filter by categories (*Tech*, *Workshops*, *Cultural*).
   - Click **"RSVP for Event"** to see instant confirmation and toast notification.
7. **Administration Console:**
   - Toggle **"Switch to Admin"** in the sidebar.
   - Inspect campus KPIs, weekly Lost & Found resolution velocity charts, and click **"Approve Match"** in the verification queue.


---

## 🖥️ UI Refresh: Dashboard Shell

The app shell now follows a modern admin-dashboard layout: a dark, collapsible sidebar (`NAVIGATION` / `WORKSPACE` sections), a lavender canvas with a large page title + live status row, round icon buttons in the top bar, tile-style quick menu, and a **Statistics** block (area chart, donut gauge, bar chart) with working *Today / Yesterday / Last 7 days / Last 30 days* range pills. After editing any source module, run `python3 build_bundle.py` to regenerate `js/bundle.js`.


---

## 🔧 Backend (optional)

The web app runs entirely on mock data in `js/data.js`. A read-only API is included for later wiring:

```bash
cd backend
cp .env.example .env        # local settings; never commit or share the real .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000   # /api/health, /api/events, /api/study-spaces
```
Tables are created on startup and start empty (there is no seed script yet).

---

## 🔐 Login (demo)

UniPulse opens on a sign-in screen with separate **Student** and **Admin** tabs. Only admin accounts can open the Admin Console.

| Role | ID | Password |
|------|----|----------|
| Student | `STU2027001` | `Student@123` |
| Admin | `ADM001` | `Admin@123` |

Add or change accounts in `js/auth.js` (passwords are stored as salted SHA-256 hashes; make one with `python3 tools/hash_password.py ID PASSWORD`), then run `python3 build_bundle.py`. Set `SHOW_DEMO_HINT = false` to hide the demo box.
This login runs in the browser only, so it is a demo. For real use, verify logins and roles on the server.
