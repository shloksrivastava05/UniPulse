/**
 * UniPulse Standalone Production Bundle
 * Designed for zero-dependency execution across HTTP and direct file:// preview.
 */
(function() {
  'use strict';

  // --- Source: js/theme.js ---
  /**
   * UniPulse Theme Manager
   * Handles Light / Dark / System appearance preference, persistence,
   * live OS-theme change detection, and the toggle UI's icon/label helpers.
   */
  
  const THEME_STORAGE_KEY = "unipulse-theme";
  let systemChangeHandlerBound = false;
  
  function getThemePreference() {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
    } catch (e) {
      /* localStorage unavailable (private browsing, etc.) — fall back below */
    }
    return "dark";
  }
  
  function systemPrefersDark() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  
  function resolveIsDark(preference) {
    if (preference === "dark") return true;
    if (preference === "light") return false;
    return systemPrefersDark();
  }
  
  function applyTheme(preference) {
    const isDark = resolveIsDark(preference);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.setAttribute("data-theme-preference", preference);
  }
  
  function setThemePreference(preference) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch (e) {
      /* ignore write failures */
    }
    applyTheme(preference);
  }
  
  function isDarkActive() {
    return resolveIsDark(getThemePreference());
  }
  
  function initTheme() {
    applyTheme(getThemePreference());
  
    if (window.matchMedia && !systemChangeHandlerBound) {
      systemChangeHandlerBound = true;
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        if (getThemePreference() === "system") {
          applyTheme("system");
        }
      };
      if (mq.addEventListener) {
        mq.addEventListener("change", handler);
      } else if (mq.addListener) {
        // Safari < 14 fallback
        mq.addListener(handler);
      }
    }
  }
  
  // Small inline icon set for the toggle button/dropdown (currentColor-based, theme-safe)
  const THEME_ICONS = {
    light: `<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.364 6.364l-1.06-1.06M6.696 6.696L5.636 5.636m12.728 0l-1.06 1.06M6.696 17.304l-1.06 1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"/></svg>`,
    dark: `<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
    system: `<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`
  };
  
  function getThemeToggleIconMarkup(preference) {
    return THEME_ICONS[preference] || THEME_ICONS.system;
  }
  
  const THEME_OPTIONS = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" }
  ];

  // --- Source: js/data.js ---
  /**
   * UniPulse Campus Dataset & Mock Store
   * High-fidelity, realistic university data for a world-class smart campus platform.
   */
  
  const mockUser = {
    id: "stu-88291",
    name: "Shlok Srivastava",
    firstName: "Shlok",
    email: "s.srivastava@university.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    course: "B.S. Computer Science & Human-Computer Interaction",
    department: "School of Computing & Data Science",
    year: "Class of 2027 (Junior)",
    studentId: "STU-8829104",
    status: "Full-time • Verified Student",
    currentLocation: {
      zone: "North Campus",
      quad: "Science Quad",
      nearBuilding: "Block 34",
      x: 420,
      y: 280
    },
    interests: [
      "Artificial Intelligence",
      "UI/UX Design",
      "Robotics",
      "Badminton",
      "Hackathons",
      "Specialty Coffee",
      "Open Source"
    ],
    savedEventIds: ["evt-1", "evt-4"],
    myReports: [
      {
        id: "rep-101",
        type: "lost",
        title: "Navy Blue Hydro Flask 32oz",
        category: "Drinkware",
        location: "Student Commons, Level 2 Lounge",
        date: "Today, 1:15 PM",
        status: "AI Matched",
        matchScore: 91,
        matchedItemId: "found-201",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: "rep-102",
        type: "lost",
        title: "AirPods Pro Gen 2 Case",
        category: "Electronics",
        location: "Engineering Lab B, Block 34",
        date: "Yesterday, 4:45 PM",
        status: "Investigating",
        matchScore: null,
        matchedItemId: null,
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&auto=format&fit=crop&q=80"
      }
    ],
    notificationPreferences: {
      aiMatchAlerts: true,
      studySpaceAvailability: true,
      eventReminders: true,
      campusNotices: true,
      emailDigests: false
    }
  };
  
  const campusBuildings = [
    {
      id: "bld-34",
      code: "B-34",
      name: "Block 34 — Computer Science & Eng.",
      shortName: "Block 34",
      category: "Academic",
      faculty: "Engineering & Computing",
      mapCoords: { x: 420, y: 280, width: 90, height: 75 },
      distance: "120m",
      walkingTime: "2 min walk",
      status: "Open",
      hours: "7:00 AM – 11:00 PM",
      description: "Hub for computer science, robotics research, AI labs, and high-performance computing clusters.",
      facilities: ["Advanced Robotics Lab", "Discussion Rooms 1-12", "Hardware Prototyping Bay", "Coffee Bar Level 1"],
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: "bld-lib",
      code: "LIB-1",
      name: "William H. Gates Memorial Library",
      shortName: "Main Library",
      category: "Study",
      faculty: "University Central",
      mapCoords: { x: 260, y: 190, width: 110, height: 85 },
      distance: "280m",
      walkingTime: "4 min walk",
      status: "Open 24/7",
      hours: "Open 24 Hours",
      description: "6 floors of silent study, collaborative media suites, 3D printing studio, and university archives.",
      facilities: ["Silent Zone L3 & L4", "Media Presentation Studios", "Laptop Loan Kiosk", "Starbucks Express"],
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: "bld-commons",
      code: "SC-02",
      name: "Student Commons & Campus Hub",
      shortName: "Student Commons",
      category: "Food",
      faculty: "Student Affairs",
      mapCoords: { x: 280, y: 340, width: 100, height: 80 },
      distance: "210m",
      walkingTime: "3 min walk",
      status: "Open",
      hours: "8:00 AM – 10:00 PM",
      description: "The primary social center of campus featuring international food halls, club offices, and relaxation lounges.",
      facilities: ["Central Dining Pavilion", "Campus Lost & Found Desk", "Student Union Offices", "Game Lounge"],
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: "bld-innov",
      code: "IL-08",
      name: "Innovation & Technology Center",
      shortName: "Innovation Lab",
      category: "Academic",
      faculty: "Interdisciplinary Research",
      mapCoords: { x: 570, y: 220, width: 95, height: 75 },
      distance: "350m",
      walkingTime: "5 min walk",
      status: "Open",
      hours: "8:30 AM – 9:30 PM",
      description: "Incubator space for student startups, venture lab, VR/AR testing environment, and maker equipment.",
      facilities: ["Maker Space", "VC Pitch Room", "Design Thinking Workshop", "Podcast Sound Booths"],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: "bld-health",
      code: "HW-01",
      name: "Health & Wellbeing Pavilion",
      shortName: "Campus Health",
      category: "Medical",
      faculty: "Campus Health",
      mapCoords: { x: 150, y: 380, width: 85, height: 70 },
      distance: "420m",
      walkingTime: "6 min walk",
      status: "Open",
      hours: "8:00 AM – 7:00 PM",
      description: "Outpatient clinical services, pharmacy, mental health counseling center, and wellness retreat rooms.",
      facilities: ["Urgent Care Clinic", "Pharmacy", "Mindfulness Sanctuary", "Travel Immunization"],
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: "bld-sports",
      code: "REC-05",
      name: "Athletics & Recreation Arena",
      shortName: "Sports Complex",
      category: "Sports",
      faculty: "Athletics Dept.",
      mapCoords: { x: 560, y: 370, width: 110, height: 90 },
      distance: "490m",
      walkingTime: "7 min walk",
      status: "Open",
      hours: "6:00 AM – 11:00 PM",
      description: "Olympic swimming pool, indoor badminton courts, rock climbing tower, and strength training facility.",
      facilities: ["Badminton Courts 1-6", "50m Lap Pool", "Indoor Climbing Wall", "Spin Studio"],
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: "bld-admin",
      code: "ADM-01",
      name: "Founders Hall & Administration",
      shortName: "Administration Hall",
      category: "Administration",
      faculty: "Office of the Dean",
      mapCoords: { x: 140, y: 220, width: 80, height: 70 },
      distance: "380m",
      walkingTime: "5 min walk",
      status: "Open",
      hours: "8:30 AM – 5:00 PM",
      description: "Registrar, Financial Aid, Admissions, International Student Office, and University Leadership.",
      facilities: ["Registrar Services", "Bursar Counter", "ID Card Issuing", "Global Exchange Office"],
      image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=500&auto=format&fit=crop&q=80"
    }
  ];
  
  const studySpaces = [
    {
      id: "spc-1",
      name: "Library Silent Study Zone (Level 3)",
      buildingId: "bld-lib",
      buildingName: "Main Library",
      floor: "Floor 3",
      capacity: 45,
      availableDesks: 14,
      noiseLevel: "Silent",
      noiseColor: "emerald",
      distance: "280m",
      walkTime: "4 min",
      isOpen: true,
      hours: "Open 24/7",
      amenities: ["Power outlets at every desk", "Individual privacy dividers", "Ultra-fast Wi-Fi", "Natural lighting"],
      suitableFor: "Individual deep focus, exam cramming, reading",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "spc-2",
      name: "Discussion Room 304 — Block 34",
      buildingId: "bld-34",
      buildingName: "Block 34 (CS & Eng)",
      floor: "Floor 3",
      capacity: 8,
      availableDesks: 8,
      noiseLevel: "Collaborative",
      noiseColor: "indigo",
      distance: "120m",
      walkTime: "2 min",
      isOpen: true,
      hours: "7:00 AM – 11:00 PM",
      amenities: ["4K Touchscreen Display", "Full wall dry-erase board", "HDMI/USB-C casting", "Surround microphone"],
      suitableFor: "Group projects, coding sessions, presentation rehearsals",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "spc-3",
      name: "Innovation Lab Co-Workspace",
      buildingId: "bld-innov",
      buildingName: "Innovation Center",
      floor: "Floor 1",
      capacity: 32,
      availableDesks: 19,
      noiseLevel: "Moderate",
      noiseColor: "amber",
      distance: "350m",
      walkTime: "5 min",
      isOpen: true,
      hours: "8:30 AM – 9:30 PM",
      amenities: ["Dual monitor setups", "Herman Miller ergonomic chairs", "Coffee/Espresso bar", "Soldering station access"],
      suitableFor: "Hackathon prep, startup teamwork, software builds",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "spc-4",
      name: "Commons Mezzanine Sky Lounge",
      buildingId: "bld-commons",
      buildingName: "Student Commons",
      floor: "Floor 2",
      capacity: 60,
      availableDesks: 6,
      noiseLevel: "Moderate",
      noiseColor: "amber",
      distance: "210m",
      walkTime: "3 min",
      isOpen: true,
      hours: "8:00 AM – 10:00 PM",
      amenities: ["Comfortable lounge couches", "Outdoor balcony access", "Cafe food delivery", "USB charging ports"],
      suitableFor: "Casual study, reading with coffee, informal chats",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "spc-5",
      name: "Library Graduate Reading Room",
      buildingId: "bld-lib",
      buildingName: "Main Library",
      floor: "Floor 5",
      capacity: 25,
      availableDesks: 2,
      noiseLevel: "Silent",
      noiseColor: "emerald",
      distance: "280m",
      walkTime: "4 min",
      isOpen: true,
      hours: "Open 24/7",
      amenities: ["Oak study carrels", "Historical reference stacks", "Desk lamps with dimmers", "Climate controlled"],
      suitableFor: "Thesis writing, intense research",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=80"
    }
  ];
  
  const campusEvents = [
    {
      id: "evt-1",
      title: "Generative AI & Agentic Systems Hackathon 2026",
      category: "Tech",
      date: "Saturday, Sep 19",
      time: "9:00 AM – 9:00 PM",
      location: "Block 34, Atrium & Innovation Lab",
      organizer: "ACM Student Chapter & Google DeepMind Student Ambassadors",
      attendeesCount: 342,
      aiRecommendationReason: "Recommended because you follow AI & Machine Learning and Hackathons.",
      badge: "Featured Event",
      description: "Build cutting-edge autonomous agents and practical GenAI solutions. $10,000 prize pool, free food, mentor workshops from industry researchers.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: "evt-2",
      title: "Campus Sunset Acoustic Lawn Session",
      category: "Cultural",
      date: "Today",
      time: "6:30 PM – 8:30 PM",
      location: "Science Quad Central Lawn",
      organizer: "University Music Society",
      attendeesCount: 180,
      aiRecommendationReason: "Popular near your current location (Science Quad).",
      badge: "Happening Today",
      description: "Relax after classes with acoustic indie sets by student songwriters. Free iced matcha and artisan pastries provided.",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: "evt-3",
      title: "High-Performance GPU Computing Workshop",
      category: "Workshops",
      date: "Tomorrow",
      time: "3:00 PM – 5:00 PM",
      location: "Block 34, Room 102",
      organizer: "Computer Science Dept.",
      attendeesCount: 88,
      aiRecommendationReason: "Directly matches your course: B.S. Computer Science.",
      badge: "Skills Boost",
      description: "Hands-on session profiling CUDA kernels, PyTorch distributed training, and optimizing inference memory bandwidth.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: "evt-4",
      title: "Inter-Faculty Badminton Doubles Tournament",
      category: "Sports",
      date: "Friday, Sep 18",
      time: "5:00 PM – 8:00 PM",
      location: "Sports Complex, Courts 1-4",
      organizer: "Varsity Athletics Club",
      attendeesCount: 64,
      aiRecommendationReason: "Recommended because Badminton is in your profile interests.",
      badge: "Active Campus",
      description: "Friendly doubles tournament open to all undergraduates. Trophies, sports vouchers, and hydration stations provided.",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: "evt-5",
      title: "UI/UX Portfolio Critique & Design System Talk",
      category: "Clubs",
      date: "This Thursday",
      time: "4:00 PM – 6:00 PM",
      location: "Innovation Lab, Pitch Suite",
      organizer: "Design & HCI Collective",
      attendeesCount: 115,
      aiRecommendationReason: "Recommended based on your HCI minor and UI/UX interest.",
      badge: "Career Focus",
      description: "Bring your Figma prototypes and case studies! Senior designers from leading tech firms will do 1-on-1 portfolio reviews.",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=80"
    }
  ];
  
  const lostAndFoundItems = {
    activeMatch: {
      matchScore: 91,
      status: "Possible Match Found",
      confidenceLevel: "High Confidence",
      lostItem: {
        id: "rep-101",
        name: "Navy Blue Hydro Flask (32oz)",
        category: "Drinkware",
        reportedBy: "Shlok Srivastava (You)",
        location: "Student Commons, Level 2 Lounge",
        time: "Today, 1:15 PM",
        description: "Navy blue wide mouth thermal flask with flex cap. Has a white GitHub Octocat sticker and an MIT Hackathon holographic badge on the back side.",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=450&auto=format&fit=crop&q=80"
      },
      foundItem: {
        id: "found-201",
        name: "Dark Blue Insulated Water Bottle",
        category: "Drinkware",
        reportedBy: "Marcus Vance (Student Security Assistant)",
        location: "Student Commons, Couch Area near Piano",
        time: "Today, 2:00 PM (45m after report)",
        description: "Deep navy 32oz vacuum flask turned in to Commons Lost & Found desk. Features octocat tech sticker and silver event sticker.",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=450&auto=format&fit=crop&q=80",
        itemPickupLocation: "Student Commons Level 1 Info Desk (Desk Ref #LF-992)"
      },
      matchFactors: [
        {
          factor: "Visual & Appearance Analysis",
          passed: true,
          detail: "Computer vision confirmed deep navy matte finish, circular brand emblem, and matching sticker placement."
        },
        {
          factor: "Item Category Alignment",
          passed: true,
          detail: "Exact taxonomy match: Drinkware / Vacuum Insulated Flask (32oz)."
        },
        {
          factor: "Location Proximity",
          passed: true,
          detail: "Reported lost at Student Commons Level 2; found 18 meters away on the Level 2 couch lounge."
        },
        {
          factor: "Time Window Correlation",
          passed: true,
          detail: "Found within 45 minutes of user report timestamp."
        }
      ]
    },
    recentListings: [
      {
        id: "lf-301",
        type: "found",
        title: "Apple AirPods Pro (2nd Gen)",
        category: "Electronics",
        location: "Block 34, Discussion Room 204",
        date: "Today, 3:20 PM",
        status: "Unclaimed",
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=350&auto=format&fit=crop&q=80",
        description: "AirPods in a translucent matte gray case. Turned in to the Block 34 1st floor security terminal."
      },
      {
        id: "lf-302",
        type: "lost",
        title: "Bellroy Leather Card Sleeve (Tan)",
        category: "Personal Accessories",
        location: "Main Library Cafe area",
        date: "Today, 11:30 AM",
        status: "AI Scanning",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=350&auto=format&fit=crop&q=80",
        description: "Tan leather cardholder containing student ID card ending in #8821 and campus transit pass."
      },
      {
        id: "lf-303",
        type: "found",
        title: "Sony WH-1000XM5 Headphones",
        category: "Electronics",
        location: "Sports Complex Locker Bench",
        date: "Yesterday, 6:10 PM",
        status: "Verified & Picked Up",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=350&auto=format&fit=crop&q=80",
        description: "Silver/Platinum over-ear headphones left in black zippered carry case."
      },
      {
        id: "lf-304",
        type: "found",
        title: "TI-84 Plus CE Graphing Calculator",
        category: "Academic Equipment",
        location: "Science Quad Hall 101",
        date: "Yesterday, 2:15 PM",
        status: "Unclaimed",
        image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=350&auto=format&fit=crop&q=80",
        description: "Mint green cover with custom calculus equation formulas taped to the battery slider."
      }
    ]
  };
  
  const adminMetrics = {
    activeStudents: 14820,
    lostReportsCount: 142,
    foundReportsCount: 128,
    aiMatchResolutionRate: "94.2%",
    spacesUtilization: "68%",
    activeEventsCount: 24,
    weeklyReportsTrend: [
      { day: "Mon", lost: 18, found: 21, matched: 17 },
      { day: "Tue", lost: 24, found: 26, matched: 23 },
      { day: "Wed", lost: 32, found: 29, matched: 28 },
      { day: "Thu", lost: 28, found: 27, matched: 25 },
      { day: "Fri", lost: 22, found: 25, matched: 22 },
      { day: "Sat", lost: 10, found: 12, matched: 11 },
      { day: "Sun", lost: 8, found: 8, matched: 7 }
    ],
    spacesOverview: [
      { zone: "Main Library", totalDesks: 320, occupied: 246, pct: 77 },
      { zone: "Block 34 (Engineering)", totalDesks: 180, occupied: 118, pct: 65 },
      { zone: "Student Commons", totalDesks: 210, occupied: 135, pct: 64 },
      { zone: "Innovation Center", totalDesks: 90, occupied: 48, pct: 53 }
    ],
    pendingVerification: [
      {
        id: "pv-1",
        item: "AirPods Pro Gen 2",
        lostUser: "Shlok Srivastava (STU-88291)",
        foundBy: "Officer Martinez",
        location: "Block 34 Rm 204",
        score: "89%",
        time: "15 mins ago"
      },
      {
        id: "pv-2",
        item: "Carabiner with 4 Dorm Keys",
        lostUser: "Sarah Lin (STU-91024)",
        foundBy: "Custodial Staff (Building 12)",
        location: "Quad Pathway",
        score: "96%",
        time: "38 mins ago"
      }
    ]
  };
  
  const aiKnowledgeBase = {
    suggestions: [
      "I have 40 minutes free. Where can I study quietly?",
      "Where is Block 34 and how do I get there?",
      "I lost my blue Hydro Flask bottle earlier today",
      "What tech workshops are happening this weekend?"
    ],
    sampleAnswers: {
      "study_quietly": {
        text: "I found 3 suitable study places near you right now with low noise levels and high availability:",
        spaces: ["spc-1", "spc-2", "spc-3"],
        contextType: "spaces",
        followUp: "Would you like me to reserve a quiet study desk at the Main Library or show the walking route?"
      },
      "block_34": {
        text: "Block 34 (Computer Science & Engineering) is located directly north of your current position in the Science Quad. It's only 120 meters away (about a 2-minute walk).",
        buildingId: "bld-34",
        contextType: "building",
        followUp: "I've plotted the live walking route on your map. All robotics labs and group discussion rooms are open until 11:00 PM."
      },
      "lost_bottle": {
        text: "Good news! Our AI matching engine has identified a 91% match for your Navy Blue Hydro Flask. A dark blue 32oz bottle was turned in at the Student Commons Info Desk just 45 minutes ago.",
        contextType: "match",
        matchId: "rep-101",
        followUp: "You can inspect the side-by-side computer vision comparison and contact the desk officer to verify ownership."
      },
      "tech_events": {
        text: "Here are the top tech events happening this week curated for your profile:",
        eventIds: ["evt-1", "evt-3", "evt-5"],
        contextType: "events",
        followUp: "The Generative AI & Agentic Systems Hackathon has 342 students registered. Would you like me to RSVP for you?"
      }
    }
  };
  
  
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  // --- Source: js/auth.js ---
  /* UniPulse authentication (front-end demo).
     Passwords are stored only as salted SHA-256 hashes. Create a hash with:
     python3 tools/hash_password.py ID PASSWORD
     NOTE: a browser-only login can be bypassed by a determined user. For a real
     deployment, verify logins and roles on the server (backend/ has the models). */
  
  
  const SHOW_DEMO_HINT = true; // set to false before real use
  
  const USERS = [
    { id: "STU2027001", role: "student", name: mockUser.name, hash: "070fa69dff0c1108633131f4b5312290aa6510de54e0b915817b7ef51e035fdc" },
    { id: "ADM001", role: "admin", name: "Campus Operations", hash: "8dde2d14886ef9d82770454a6bf2247f3256ca5375d8553bd10268bd7b3f7e21" }
  ];
  
  const SESSION_KEY = "unipulse-session";
  const FAIL_KEY = "unipulse-login-fails";
  const SESSION_MS = 8 * 60 * 60 * 1000;
  const MAX_FAILS = 5;
  const LOCK_MS = 30 * 1000;
  
  const K = [], H0 = [];
  for (let n = 2, c = 0; c < 64; n++) {
    let prime = true;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) { prime = false; break; }
    if (!prime) continue;
    K.push(Math.floor((Math.cbrt(n) % 1) * 4294967296));
    if (c < 8) H0.push(Math.floor((Math.sqrt(n) % 1) * 4294967296));
    c++;
  }
  
  // Plain-JS SHA-256 (crypto.subtle is unavailable on http:// LAN addresses).
  function sha256(str) {
    const b = unescape(encodeURIComponent(str)), l = b.length;
    const len = (((l + 8) >> 6) + 1) * 16, w = new Array(len).fill(0);
    for (let i = 0; i < l; i++) w[i >> 2] |= b.charCodeAt(i) << (24 - (i % 4) * 8);
    w[l >> 2] |= 0x80 << (24 - (l % 4) * 8);
    w[len - 1] = l * 8;
    let h = H0.slice();
    for (let o = 0; o < len; o += 16) {
      const x = w.slice(o, o + 16);
      for (let i = 16; i < 64; i++) {
        const a = x[i - 15], d = x[i - 2];
        const s0 = ((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3);
        const s1 = ((d >>> 17) | (d << 15)) ^ ((d >>> 19) | (d << 13)) ^ (d >>> 10);
        x[i] = (x[i - 16] + s0 + x[i - 7] + s1) | 0;
      }
      let [a, b2, c, d, e, f, g, hh] = h;
      for (let i = 0; i < 64; i++) {
        const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        const t1 = (hh + S1 + ((e & f) ^ (~e & g)) + K[i] + x[i]) | 0;
        const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        const t2 = (S0 + ((a & b2) ^ (a & c) ^ (b2 & c))) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b2; b2 = a; a = (t1 + t2) | 0;
      }
      h = [h[0] + a, h[1] + b2, h[2] + c, h[3] + d, h[4] + e, h[5] + f, h[6] + g, h[7] + hh].map(v => v | 0);
    }
    return h.map(v => (v >>> 0).toString(16).padStart(8, "0")).join("");
  }
  
  const store = (kind) => { try { return window[kind]; } catch (e) { return null; } };
  const read = (s, k) => { try { return s && JSON.parse(s.getItem(k)); } catch (e) { return null; } };
  
  const auth = {
    SHOW_DEMO_HINT,
  
    session() {
      for (const kind of ["sessionStorage", "localStorage"]) {
        const s = store(kind), v = read(s, SESSION_KEY);
        if (v && v.exp > Date.now()) return v;
        if (v) try { s.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
      }
      return null;
    },
  
    isAdmin() { const s = this.session(); return !!s && s.role === "admin"; },
  
    login(role, id, password, remember) {
      const ss = store("sessionStorage");
      const fails = read(ss, FAIL_KEY) || { n: 0, until: 0 };
      if (fails.until > Date.now()) {
        return { ok: false, error: `Too many attempts. Try again in ${Math.ceil((fails.until - Date.now()) / 1000)}s.` };
      }
      const uid = String(id || "").trim().toUpperCase();
      const user = USERS.find(u => u.id === uid && u.role === role);
      const hash = sha256(`unipulse:${uid}:${password}`);
      if (!user || user.hash !== hash) {
        fails.n += 1;
        if (fails.n >= MAX_FAILS) { fails.n = 0; fails.until = Date.now() + LOCK_MS; }
        try { ss.setItem(FAIL_KEY, JSON.stringify(fails)); } catch (e) { /* ignore */ }
        return { ok: false, error: `Incorrect ${role} ID or password.` };
      }
      try { ss.removeItem(FAIL_KEY); } catch (e) { /* ignore */ }
      const data = JSON.stringify({ id: user.id, role: user.role, name: user.name, exp: Date.now() + SESSION_MS });
      try { store(remember ? "localStorage" : "sessionStorage").setItem(SESSION_KEY, data); } catch (e) { return { ok: false, error: "Your browser blocked saving the login." }; }
      return { ok: true };
    },
  
    logout() {
      for (const kind of ["sessionStorage", "localStorage"]) {
        try { store(kind).removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
      }
    }
  };

  // --- Source: js/components/toasts.js ---
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
  
  const toasts = new ToastManager();

  // --- Source: js/components/modals.js ---
  /**
   * UniPulse Modals & Interactive Overlays
   * Includes Report Lost/Found, 91% AI Match Reveal, Space Reservation, and Cmd+K Search.
   */
  
  
  
  
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
  
  const modals = new ModalManager();

  // --- Source: js/components/sidebar.js ---
  /**
   * UniPulse Sidebar Component
   * Glass sidebar with badges, a collapsible "Campus" group (slide-down tree), collapsible rail and user card.
   */
  
  
  
  
  const sbIcon = (d) => `<svg class="w-[15px] h-[15px] shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="${d}"/></svg>`;
  
  let sbGroupOpen = true;
  function setSidebarGroupOpen(v) { sbGroupOpen = !!v; }
  
  const SB_TOP = [
    { id: "dashboard", label: "Home", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: "assistant", label: "AI Assistant", badge: "AI", d: "M13 10V3L4 14h7v7l9-11h-7z" },
    { id: "lostFound", label: "Lost & Found", badge: "1", ok: true, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }
  ];
  const SB_GROUP = [
    { id: "campusMap", label: "Campus Finder", d: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
    { id: "spaces", label: "Spaces", d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { id: "events", label: "Events", badge: "New", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }
  ];
  const SB_BOTTOM = [
    { id: "profile", label: "Profile", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }
  ];
  
  function renderSidebar(currentRoute = "dashboard", isAdminMode = false, collapsed = false) {
    const navBtn = (n, active, extra = "") => `
      <button ${extra} data-route="${n.id}" title="${n.label}" class="nav-link-btn up-nav ${active ? "is-active" : ""}">
        ${sbIcon(n.d)}
        <span class="up-label flex-1 text-left">${n.label}</span>
        ${n.badge ? `<span class="up-label up-badge ${n.ok ? "ok" : ""}">${n.badge}</span>` : ""}
      </button>`;
    const act = (id) => currentRoute === id && !isAdminMode;
    const inGroup = SB_GROUP.some(g => act(g.id));
    const open = sbGroupOpen || inGroup;
  
    const groupHtml = collapsed
      ? SB_GROUP.map(n => navBtn(n, act(n.id))).join("")
      : `
        <button id="nav-group-btn" class="up-nav up-group-btn ${open ? "open" : ""} ${inGroup ? "has-active" : ""}">
          ${sbIcon("M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z")}
          <span class="up-label flex-1 text-left">Campus</span>
          <svg class="up-chev w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="nav-group-body" class="up-collapsible ${open ? "open" : ""}">
          <div><div class="up-tree">
            ${SB_GROUP.map(n => `<button data-route="${n.id}" class="nav-link-btn up-sub ${act(n.id) ? "is-active" : ""}"><span>${n.label}</span>${n.badge ? `<span class="up-badge">${n.badge}</span>` : ""}</button>`).join("")}
          </div></div>
        </div>`;
  
    return `
      <aside class="up-sidebar ${collapsed ? "collapsed" : ""}">
        <button id="sidebar-collapse-btn" class="up-collapse" aria-label="Toggle sidebar" title="Toggle sidebar">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="${collapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}"/></svg>
        </button>
  
        <div>
          <div class="up-brand">
            <div id="brand-logo-btn" class="flex items-center gap-2.5 cursor-pointer min-w-0">
              <div class="up-logo">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="12,4 18.93,8 18.93,16 12,20 5.07,16 5.07,8" stroke-width="2.4" stroke-linejoin="round"/><polyline points="7,12 9,12 10.5,8.5 13,15.5 14.5,12 17,12" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="up-label">UniPulse</span>
            </div>
          </div>
  
          <nav>
            ${SB_TOP.map(n => navBtn(n.id === "lostFound" ? { ...n, badge: lostAndFoundItems.activeMatch ? "1" : "" } : n, act(n.id))).join("")}
            ${groupHtml}
            ${SB_BOTTOM.map(n => navBtn(n, act(n.id))).join("")}
            ${!auth.isAdmin() ? "" : navBtn({ id: "admin", label: "Admin Console", badge: "Staff", d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }, isAdminMode, 'id="admin-nav-btn"')}
          </nav>
        </div>
  
        <div class="up-foot">
          <button id="sidebar-report-btn" class="up-cta up-label">+ Report lost item</button>
          <div class="up-mode up-label">
            <span class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full ${isAdminMode ? "bg-amber-400" : "bg-emerald-400"}"></span>${isAdminMode ? "Admin Console" : "Student View"}</span>
            ${auth.isAdmin() ? `<button id="toggle-role-mode-btn">${isAdminMode ? "Student" : "Admin"}</button>` : ""}
          </div>
          <div class="relative">
            ${renderAccountMenu("sidebar-profile-menu", "bottom-full left-0 mb-2 up-slide-up")}
            <div class="up-user" id="sidebar-profile-trigger" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false">
              <img src="${mockUser.avatar}" alt="${mockUser.name}" class="w-8 h-8 rounded-full object-cover shrink-0">
              <div class="up-label min-w-0 flex-1">
                <p class="truncate text-[12px] font-semibold text-white">${auth.isAdmin() ? "Campus Operations" : mockUser.name}</p>
                <p class="truncate text-[10.5px]" style="color:#9A98AE">${auth.isAdmin() ? "Staff" : "CS '27"} • ${(auth.session() || {}).id || ""}</p>
              </div>
              <svg class="up-label w-3.5 h-3.5 shrink-0" style="color:#9A98AE" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"/></svg>
            </div>
          </div>
        </div>
      </aside>
    `;
  }
  
  function renderMobileNav(currentRoute = "dashboard") {
    const mobileItems = [
      { id: "dashboard", label: "Home", icon: "🏠" },
      { id: "assistant", label: "AI", icon: "✨" },
      { id: "campusMap", label: "Map", icon: "🗺️" },
      { id: "lostFound", label: "Lost&Found", icon: "🔍" },
      { id: "spaces", label: "Spaces", icon: "📚" },
      { id: "events", label: "Events", icon: "📅" }
    ];
  
    return `
      <nav class="up-mobile-nav md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 py-2 flex items-center justify-around shadow-lg">
        ${mobileItems.map(item => `
          <button data-route="${item.id}" class="mobile-nav-btn flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[11px] font-semibold ${
            currentRoute === item.id ? "text-indigo-600 font-bold" : "text-slate-500"
          }">
            <span class="text-lg">${item.icon}</span>
            <span>${item.label}</span>
          </button>
        `).join("")}
      </nav>
    `;
  }
  
  function renderAccountMenu(id, position) {
    const item = (attrs, label) => `<button role="menuitem" ${attrs} class="up-menu-item">${label}</button>`;
    return `
      <div id="${id}" role="menu" class="hidden absolute ${position} w-60 glass-dropdown rounded-2xl py-2 z-50">
        ${item('data-menu-route="profile"', "Profile Settings")}
        ${item('data-menu-route="profile"', "View Profile")}
        <div class="up-menu-sep" role="separator"></div>
        ${item('data-menu-route="campusMap"', "Campus Finder")}
        ${item('data-menu-route="spaces"', "Study Spaces")}
        ${item('data-menu-route="events"', "Events")}
        <div class="up-menu-sep" role="separator"></div>
        ${auth.isAdmin() ? item('data-menu-route="admin"', "Admin Console") : ""}
        ${item('data-menu-logout="1"', "Log out")}
      </div>`;
  }

  // --- Source: js/components/header.js ---
  /**
   * UniPulse Global Header Component
   * Contains page title, Cmd+K global search trigger, campus location badge, and notifications flyout.
   */
  
  
  
  
  
  const routeMeta = {
    dashboard: {
      title: "Campus Hub",
      subtitle: "Real-time updates, AI suggestions, and student services"
    },
    assistant: {
      title: "AI Campus Assistant",
      subtitle: "Ask anything about courses, facilities, study spaces, or lost items"
    },
    campusMap: {
      title: "Interactive Campus Finder",
      subtitle: "Vector campus directory, real-time walking routes, and facility statuses"
    },
    lostFound: {
      title: "Smart Lost & Found",
      subtitle: "Explainable multi-factor AI matching for university belongings"
    },
    spaces: {
      title: "Live Study Spaces",
      subtitle: "Real-time desk availability, noise atmosphere ratings, and instant booking"
    },
    events: {
      title: "Campus Events & Activities",
      subtitle: "Personalized recommendations, student clubs, and tech hackathons"
    },
    profile: {
      title: "Student Profile",
      subtitle: "Manage academic details, interests, and report history"
    },
    admin: {
      title: "Administration Console",
      subtitle: "Campus-wide service analytics, capacity monitoring, and report auditing"
    }
  };
  
  function renderHeader(currentRoute = "dashboard") {
    const meta = routeMeta[currentRoute] || routeMeta.dashboard;
    const activeThemePref = getThemePreference();
  
    return `
      <header class="up-header">
        <div class="min-w-0">
          <h1 class="text-[22px] leading-7 font-extrabold tracking-tight text-slate-900 truncate">${meta.title}</h1>
          <div class="mt-1 flex items-center gap-4 text-[11px] text-slate-500 min-w-0">
            <span class="inline-flex items-center gap-1.5 shrink-0 font-medium"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Live</span>
            <span class="hidden md:inline truncate">${meta.subtitle}</span>
            <span class="hidden xl:inline-flex items-center gap-1 shrink-0 text-slate-400"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>North Campus, Science Quad</span>
          </div>
        </div>
  
        <div class="flex items-center gap-2 shrink-0">
          <button id="global-search-trigger" class="up-search btn-press">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <span class="hidden sm:inline flex-1 text-left">Search</span>
            <kbd class="hidden sm:inline-block">⌘K</kbd>
          </button>
  
          <div class="flex items-center gap-2 ml-1">
            <button id="header-chat-btn" class="up-circle-btn btn-press" title="Ask the AI assistant" aria-label="Ask the AI assistant">
              <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.83L3 20l1.3-3.9C3.48 14.9 3 13.5 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            </button>
  
            <!-- Theme Toggle with Flyout Dropdown -->
            <div class="relative" id="theme-toggle-wrapper">
              <button id="theme-toggle-btn" class="up-circle-btn btn-press" title="Change appearance" aria-label="Change appearance">
                ${getThemeToggleIconMarkup(isDarkActive() ? "dark" : "light")}
              </button>
  
              <div id="theme-toggle-dropdown" class="hidden absolute right-0 mt-2 w-44 glass-dropdown rounded-2xl p-1.5 z-50 up-slide-down shadow-xl">
                ${THEME_OPTIONS.map(opt => `
                  <button data-theme-option="${opt.value}" class="theme-option-btn w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${opt.value === activeThemePref ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}">
                    ${getThemeToggleIconMarkup(opt.value)}
                    <span class="flex-1 text-left">${opt.label}</span>
                    ${opt.value === activeThemePref ? '<svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>' : ''}
                  </button>
                `).join('')}
              </div>
            </div>
  
            <!-- Notification Bell with Flyout Dropdown -->
            <div class="relative" id="notifications-wrapper">
              <button id="notifications-btn" class="up-circle-btn btn-press">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              </button>
  
              <!-- Notifications Dropdown -->
              <div id="notifications-dropdown" class="hidden absolute right-0 mt-2 w-80 sm:w-96 glass-dropdown rounded-2xl p-4 z-50 up-slide-down shadow-xl">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 class="text-sm font-bold text-slate-900">Notifications</h4>
                  <span class="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer">Mark all as read</span>
                </div>
                <div class="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  <!-- Item 1: AI Match Alert -->
                  <div class="py-3 flex items-start gap-3 hover:bg-slate-50/80 p-2 rounded-xl cursor-pointer" id="notif-match-item">
                    <div class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 text-sm">
                      ✨
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-slate-900">AI Match Detected: 91% Match</p>
                      <p class="text-[11px] text-slate-600 mt-0.5">Found item matching your "Navy Blue Hydro Flask" turned in at Student Commons.</p>
                      <span class="text-[10px] text-indigo-600 font-semibold mt-1 inline-block">12 minutes ago • Click to review</span>
                    </div>
                  </div>
  
                  <!-- Item 2: Space Alert -->
                  <div class="py-3 flex items-start gap-3 hover:bg-slate-50/80 p-2 rounded-xl cursor-pointer">
                    <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-sm">
                      📚
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-slate-900">Study Space Openings</p>
                      <p class="text-[11px] text-slate-600 mt-0.5">Discussion Room 304 in Block 34 is currently unoccupied.</p>
                      <span class="text-[10px] text-slate-400 mt-1 inline-block">35 minutes ago</span>
                    </div>
                  </div>
  
                  <!-- Item 3: Event RSVP -->
                  <div class="py-3 flex items-start gap-3 hover:bg-slate-50/80 p-2 rounded-xl cursor-pointer">
                    <div class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 text-sm">
                      🚀
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-slate-900">Hackathon Team Matching</p>
                      <p class="text-[11px] text-slate-600 mt-0.5">Agentic AI Hackathon starts in 5 days. 3 students looking for front-end teammates.</p>
                      <span class="text-[10px] text-slate-400 mt-1 inline-block">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Account menu (mobile only; on desktop it lives in the sidebar) -->
            <div class="relative md:hidden">
              <button id="header-avatar-btn" class="flex items-center rounded-full" aria-haspopup="true" aria-expanded="false" aria-label="Account menu"><img src="${mockUser.avatar}" alt="${mockUser.name}" class="w-8 h-8 rounded-full object-cover"></button>
              ${renderAccountMenu("header-profile-menu", "right-0 mt-3 up-slide-down")}
            </div>
  
          </div>
        </div>
      </header>
    `;
  }

  // --- Source: js/views/dashboard.js ---
  /**
   * UniPulse Dashboard View
   * Features dynamic student greeting, rotating hero search bar, quick actions,
   * AI suggestions, campus snapshot metrics, and curated "For You" event cards.
   */
  
  
  
  
  
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
  
  function renderDashboard() {
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
  
  function initDashboardListeners(onNavigate) {
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

  // --- Source: js/views/assistant.js ---
  /**
   * UniPulse AI Assistant View
   * Dedicated split-view conversational interface with structured response cards,
   * typing indicators, suggested prompts, and a dynamic Right Context Panel.
   */
  
  
  
  
  function renderAssistant(initialQuery = "") {
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
  
  function initAssistantListeners(onNavigate, initialQuery = "") {
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

  // --- Source: js/views/campusMap.js ---
  /**
   * UniPulse Campus Finder View
   * Features an interactive vector SVG campus map with user beacon,
   * animated walking route polylines, building node highlights, and facility details.
   */
  
  
  
  
  function renderCampusMap(selectedBuildingId = "bld-34") {
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
  
  function initCampusMapListeners(selectedBuildingId = "bld-34") {
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

  // --- Source: js/views/lostFound.js ---
  /**
   * UniPulse Lost & Found View
   * Flagship module featuring dual prominent CTAs, active 91% AI match hero banner,
   * explainable match indicators, listings feed, and category filters.
   */
  
  
  
  
  function renderLostFound() {
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
  
  function initLostFoundListeners() {
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

  // --- Source: js/views/spaces.js ---
  /**
   * UniPulse Study Spaces View
   * Dedicated availability page with live seat capacity meters, noise level atmosphere ratings,
   * amenity tags, and instant desk reservation flows.
   */
  
  
  
  
  function renderSpaces() {
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
  
  function initSpacesListeners(onNavigate) {
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

  // --- Source: js/views/events.js ---
  /**
   * UniPulse Campus Events View
   * Personalized event discovery with AI recommendation rationale,
   * category filters, and real-time RSVP interactions.
   */
  
  
  
  
  function renderEvents() {
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
  
  function initEventsListeners() {
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

  // --- Source: js/views/profile.js ---
  /**
   * UniPulse Student Profile View
   * Displays student credentials, academic details, customizable interest tags,
   * report tracking timeline, saved events, and notification preferences.
   */
  
  
  
  
  
  
  function renderProfile() {
    const savedEvents = campusEvents.filter(e => mockUser.savedEventIds.includes(e.id));
  
    return `
      <div class="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        <!-- Profile Header Card -->
        <div class="p-6 md:p-8 rounded-[24px] bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div class="relative">
              <img src="${mockUser.avatar}" alt="${mockUser.name}" class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md">
              <span class="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" title="Verified Student"></span>
            </div>
            <div>
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 class="text-2xl font-black text-slate-900">${mockUser.name}</h2>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Verified Student
                </span>
              </div>
              <p class="text-sm font-semibold text-slate-700 mt-1">${mockUser.course}</p>
              <p class="text-xs text-slate-400 mt-0.5">${mockUser.department} • ${mockUser.year}</p>
              <p class="text-xs font-mono text-slate-400 mt-1">Student ID: ${mockUser.studentId}</p>
            </div>
          </div>
  
          <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button id="profile-edit-interests-btn" class="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold btn-press">
              Edit Interests
            </button>
            <button id="profile-share-id-btn" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 btn-press">
              Digital Student Pass
            </button>
          </div>
        </div>
  
        <!-- Interest Tags (Influences AI Recommendations) -->
        <div class="p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Academic & Social Interests</h3>
              <p class="text-xs text-slate-400">UniPulse AI uses these tags to recommend campus events and study groups.</p>
            </div>
            <button id="add-interest-prompt-btn" class="text-xs font-bold text-indigo-600 hover:underline">+ Add Topic</button>
          </div>
  
          <div class="flex flex-wrap gap-2" id="profile-interests-container">
            ${mockUser.interests.map(interest => `
              <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-200/70 text-indigo-900 text-xs font-semibold">
                <span>${interest}</span>
                <button class="remove-interest-btn text-indigo-400 hover:text-indigo-800" data-interest="${interest}">×</button>
              </span>
            `).join("")}
          </div>
        </div>
  
        <!-- Two Columns: My Reports & Saved Events -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Column 1: My Lost & Found Reports -->
          <div class="p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">My Lost & Found Reports</h3>
                <p class="text-xs text-slate-400">Active status and AI matching history</p>
              </div>
              <button id="profile-report-btn" class="text-xs font-bold text-indigo-600 hover:underline">+ New Report</button>
            </div>
  
            <div class="space-y-3">
              ${mockUser.myReports.map(rep => `
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
                  <img src="${rep.image}" alt="${rep.title}" class="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                      <h5 class="text-xs font-bold text-slate-900 truncate">${rep.title}</h5>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rep.status === "AI Matched" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }">
                        ${rep.status} ${rep.matchScore ? `(${rep.matchScore}%)` : ""}
                      </span>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-1">📍 ${rep.location}</p>
                    <p class="text-[11px] text-slate-400">${rep.date}</p>
                    ${rep.matchScore ? `
                      <button class="profile-view-match-btn text-xs font-bold text-indigo-600 hover:underline mt-2 inline-block">
                        View 91% Match Details →
                      </button>
                    ` : ""}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
  
          <!-- Column 2: Saved Events -->
          <div class="p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Saved Campus Events</h3>
                <p class="text-xs text-slate-400">Your registered workshops & activities</p>
              </div>
              <span class="text-xs font-bold text-slate-500">${savedEvents.length} Saved</span>
            </div>
  
            <div class="space-y-3">
              ${savedEvents.map(evt => `
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
                  <img src="${evt.image}" alt="${evt.title}" class="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0">
                  <div class="flex-1 min-w-0">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-purple-700">${evt.category}</span>
                    <h5 class="text-xs font-bold text-slate-900 truncate mt-0.5">${evt.title}</h5>
                    <p class="text-[11px] text-slate-500 mt-1">📅 ${evt.date} • ${evt.time}</p>
                    <p class="text-[11px] text-slate-400">📍 ${evt.location}</p>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
  
        </div>
  
        <!-- Appearance -->
        <div class="p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Appearance</h3>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p class="font-bold text-slate-800 text-xs">Theme</p>
              <p class="text-slate-500 mt-0.5 text-xs">Choose how UniPulse looks on this device.</p>
            </div>
            <div id="profile-theme-options" class="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-50 border border-slate-200/80">
              ${THEME_OPTIONS.map(opt => `
                <button data-theme-option="${opt.value}" class="profile-theme-option-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${opt.value === getThemePreference() ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}">
                  ${getThemeToggleIconMarkup(opt.value)}
                  <span>${opt.label}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
  
        <!-- Notification Preferences -->
        <div class="p-6 rounded-[24px] bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Notification Preferences</h3>
          <div class="divide-y divide-slate-100 text-xs">
            <div class="py-3 flex items-center justify-between">
              <div>
                <p class="font-bold text-slate-800">AI Lost & Found Match Alerts</p>
                <p class="text-slate-500 mt-0.5">Instant notification when vision models detect a 85%+ match for your reported belongings.</p>
              </div>
              <input type="checkbox" checked class="pref-toggle rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4">
            </div>
            <div class="py-3 flex items-center justify-between">
              <div>
                <p class="font-bold text-slate-800">Study Space Openings</p>
                <p class="text-slate-500 mt-0.5">Receive an alert when your preferred quiet study rooms drop below 50% capacity.</p>
              </div>
              <input type="checkbox" checked class="pref-toggle rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4">
            </div>
            <div class="py-3 flex items-center justify-between">
              <div>
                <p class="font-bold text-slate-800">Campus Event Reminders</p>
                <p class="text-slate-500 mt-0.5">Remind me 1 hour prior to bookmarked events and club meetings.</p>
              </div>
              <input type="checkbox" checked class="pref-toggle rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4">
            </div>
          </div>
        </div>
  
      </div>
    `;
  }
  
  function initProfileListeners() {
    // Appearance: Theme option buttons
    document.querySelectorAll(".profile-theme-option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        setThemePreference(btn.dataset.themeOption);
        if (window.unipulse) {
          window.unipulse.render();
        }
      });
    });
  
    // View Match from report
    document.querySelectorAll(".profile-view-match-btn").forEach(btn => {
      btn.addEventListener("click", () => modals.openMatchResultModal(lostAndFoundItems.activeMatch));
    });
  
    // Digital pass
    const passBtn = document.getElementById("profile-share-id-btn");
    if (passBtn) {
      passBtn.addEventListener("click", () => {
        toasts.show({
          title: "Digital Pass Active",
          message: "STU-8829104 verified with Campus NFC & Security barcode.",
          type: "success"
        });
      });
    }
  
    // Remove interest
    document.querySelectorAll(".remove-interest-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const topic = btn.dataset.interest;
        btn.parentElement.remove();
        toasts.show({
          title: "Interest Removed",
          message: `Removed "${topic}" from your recommendation preferences.`,
          type: "info"
        });
      });
    });
  
    // Add interest prompt
    const addBtn = document.getElementById("add-interest-prompt-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const topic = prompt("Enter a new interest or topic (e.g. Cybersecurity, Photography, Tennis):");
        if (topic && topic.trim()) {
          const container = document.getElementById("profile-interests-container");
          const span = document.createElement("span");
          span.className = "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-200/70 text-indigo-900 text-xs font-semibold animate-fade-in";
          span.innerHTML = `<span>${topic.trim()}</span><button class="remove-interest-btn text-indigo-400 hover:text-indigo-800">×</button>`;
          container.appendChild(span);
          toasts.show({
            title: "Interest Added",
            message: `Added "${topic.trim()}" to your recommendation profile.`,
            type: "success"
          });
        }
      });
    }
  
    // New report
    const reportBtn = document.getElementById("profile-report-btn");
    if (reportBtn) {
      reportBtn.addEventListener("click", () => modals.openLostReportModal());
    }
  }

  // --- Source: js/views/admin.js ---
  /**
   * UniPulse Admin Console View
   * Campus Operations & Administration Portal
   * Features key performance metrics, SVG Lost & Found weekly activity chart,
   * space capacity distribution, and AI match auditing queue.
   */
  
  
  
  
  
  function renderAdmin() {
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
  
  function initAdminListeners(onNavigate) {
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

  // --- Source: js/views/login.js ---
  
  
  function renderLogin() {
    const demo = auth.SHOW_DEMO_HINT ? `
      <div class="mt-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-3 text-[11.5px] text-slate-500 dark:text-slate-400">
        <p class="font-semibold mb-1">Demo accounts</p>
        <p>Student: <b>STU2027001</b> / <b>Student@123</b></p>
        <p>Admin: <b>ADM001</b> / <b>Admin@123</b></p>
      </div>` : "";
    return `
      <div class="flex items-center justify-center p-4 bg-[#F6F6FB] dark:bg-[#0E0A20] text-slate-900 dark:text-slate-100" style="min-height:100vh;min-height:100dvh">
        <div class="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-6 sm:p-8">
          <div class="flex items-center gap-2.5 mb-6">
            <span class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold">U</span>
            <div><p class="font-extrabold text-lg leading-tight">UniPulse</p><p class="text-xs text-slate-500 dark:text-slate-400">Sign in to your campus account</p></div>
          </div>
          <div class="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 mb-5" role="tablist">
            <button type="button" data-role="student" class="login-role-tab py-2 rounded-lg text-sm font-semibold" role="tab">Student</button>
            <button type="button" data-role="admin" class="login-role-tab py-2 rounded-lg text-sm font-semibold" role="tab">Admin</button>
          </div>
          <form id="login-form" class="space-y-4" novalidate>
            <div>
              <label id="login-id-label" for="login-id" class="block text-xs font-semibold mb-1.5"></label>
              <input id="login-id" type="text" autocomplete="username" autocapitalize="characters" spellcheck="false" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:border-indigo-600 text-sm">
            </div>
            <div>
              <label for="login-pass" class="block text-xs font-semibold mb-1.5">Password</label>
              <div class="relative">
                <input id="login-pass" type="password" autocomplete="current-password" required class="w-full pl-4 pr-16 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:border-indigo-600 text-sm">
                <button type="button" id="login-toggle-pass" class="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-indigo-600">Show</button>
              </div>
            </div>
            <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><input id="login-remember" type="checkbox" class="rounded"> Keep me signed in on this device</label>
            <p id="login-error" role="alert" class="hidden text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-500/10 rounded-lg px-3 py-2"></p>
            <button type="submit" class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold btn-press">Sign in</button>
          </form>
          ${demo}
        </div>
      </div>`;
  }
  
  function initLogin(onSuccess) {
    let role = "student";
    const $ = (id) => document.getElementById(id);
    const tabs = document.querySelectorAll(".login-role-tab");
    const err = $("login-error");
    const setRole = (r) => {
      role = r;
      tabs.forEach(t => {
        const on = t.dataset.role === r;
        t.setAttribute("aria-selected", on);
        t.className = "login-role-tab py-2 rounded-lg text-sm font-semibold " + (on ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500 dark:text-slate-400");
      });
      $("login-id-label").textContent = r === "admin" ? "Admin ID" : "Student ID";
      $("login-id").placeholder = r === "admin" ? "e.g. ADM001" : "e.g. STU2027001";
      err.classList.add("hidden");
    };
    tabs.forEach(t => t.addEventListener("click", () => setRole(t.dataset.role)));
    $("login-toggle-pass").addEventListener("click", () => {
      const p = $("login-pass"), show = p.type === "password";
      p.type = show ? "text" : "password";
      $("login-toggle-pass").textContent = show ? "Hide" : "Show";
    });
    $("login-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const res = auth.login(role, $("login-id").value, $("login-pass").value, $("login-remember").checked);
      if (res.ok) { onSuccess(); return; }
      err.textContent = res.error;
      err.classList.remove("hidden");
      $("login-pass").value = "";
      $("login-pass").focus();
    });
    setRole("student");
    $("login-id").focus();
  }

  // --- Source: js/app.js ---
  /**
   * UniPulse Main Application Orchestrator
   * Client-side router, state management, modal & keyboard bindings,
   * and dynamic view rendering.
   */
  
  
  
  
  
  
  
  
  // View Renderers & Initializers
  
  
  
  
  
  
  
  
  
  
  
  const APP_MENU_PAIRS = [
    ["theme-toggle-btn", "theme-toggle-dropdown"],
    ["notifications-btn", "notifications-dropdown"],
    ["sidebar-profile-trigger", "sidebar-profile-menu"],
    ["header-avatar-btn", "header-profile-menu"]
  ];
  
  class UniPulseApp {
    constructor() {
      this.currentRoute = "dashboard";
      this.isAdminMode = false;
      this.routeParams = {};
      this.activeCleanup = null;
      this.sidebarCollapsed = false;
    }
  
    init() {
      if (!auth.session()) { this.showLogin(); return; }
      this.start();
    }
  
    showLogin() {
      document.getElementById("app-root").innerHTML = renderLogin();
      initLogin(() => {
        window.location.hash = "";
        this.currentRoute = auth.isAdmin() ? "admin" : "dashboard";
        this.isAdminMode = auth.isAdmin();
        this.start();
      });
    }
  
    start() {
      // Read route from URL hash if present
      const hash = window.location.hash.replace("#", "").trim();
      if (hash) {
        if (hash === "admin" && auth.isAdmin()) {
          this.isAdminMode = true;
          this.currentRoute = "admin";
        } else {
          this.currentRoute = hash === "admin" ? "dashboard" : hash;
        }
      }
  
      this.bindGlobalShortcuts();
      this.render();
  
      // Listen to hash changes
      window.addEventListener("hashchange", () => {
        // Always dismiss any stuck-open modal on ANY hash change — including
        // navigating back to Home, where the hash clears to an empty string
        // entirely. That empty-hash case used to fall through this handler
        // untouched, so a modal left open never got told to close.
        modals.close();
  
        const newHash = window.location.hash.replace("#", "").trim() || "dashboard";
        if (newHash !== this.currentRoute) {
          this.navigate(newHash);
        }
      });
  
      // Initial welcoming sound/chime trigger on first user click
      window.addEventListener("click", () => {
        // Warm up audio context
      }, { once: true });
    }
  
    navigate(route, params = {}) {
      // Always dismiss any open modal on route change. The modal overlay lives
      // outside #app-root (appended directly to <body>), so it survives a
      // route re-render untouched — if it was left open (e.g. the user hit
      // the browser Back button instead of clicking Close), its blurred
      // backdrop would otherwise stay stuck on screen over the new page.
      modals.close();
  
      // Role guard: only admin accounts may open the admin console.
      if (route === "admin" && !auth.isAdmin()) {
        route = "dashboard";
        params = { ...params, isAdminMode: false };
      }
  
      if (this.activeCleanup && typeof this.activeCleanup === "function") {
        this.activeCleanup();
        this.activeCleanup = null;
      }
  
      if (params.isAdminMode !== undefined) {
        this.isAdminMode = params.isAdminMode;
      } else if (route === "admin") {
        this.isAdminMode = true;
      } else {
        this.isAdminMode = false;
      }
  
      this.currentRoute = route;
      this.routeParams = params;
      window.location.hash = route;
      this.render();
    }
  
    bindGlobalShortcuts() {
      // One-time listeners for every dropdown: outside click, Esc, arrow keys
      document.addEventListener("click", (e) => {
        if (!e.target.closest('[role="menu"], #theme-toggle-dropdown, #notifications-dropdown')) this.closeMenus();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { this.closeMenus(); return; }
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        const open = document.querySelector('[role="menu"]:not(.hidden)');
        if (!open) return;
        e.preventDefault();
        const items = Array.from(open.querySelectorAll(".up-menu-item"));
        const i = items.indexOf(document.activeElement);
        const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i <= 0 ? items.length - 1 : i - 1);
        items[next].focus();
      });
  
      // Cmd+K or Ctrl+K shortcut
      document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          this.openGlobalSearch();
        }
      });
    }
  
    openGlobalSearch() {
      modals.openCommandPalette((selection) => {
        if (selection.target) {
          if (selection.target === "campusMap" && selection.building) {
            this.navigate("campusMap", { selectedBuildingId: selection.building });
          } else if (selection.target === "assistant") {
            this.navigate("assistant", { initialQuery: "I have 40 minutes free. Where can I study quietly?" });
          } else {
            this.navigate(selection.target);
          }
        }
      });
    }
  
    render() {
      const root = document.getElementById("app-root");
      if (!root) return;
  
      // Outer Shell Layout: Left Sidebar + (Header + Main View) + Mobile Nav
      root.innerHTML = `
        <div class="flex min-h-screen up-page text-slate-900 font-sans">
          <!-- Desktop Sidebar (Hidden on Mobile) -->
          <div class="hidden md:block">
            ${renderSidebar(this.currentRoute, this.isAdminMode, this.sidebarCollapsed)}
          </div>
  
          <!-- Main Content Area -->
          <div class="flex-1 flex flex-col min-w-0 up-content">
            ${renderHeader(this.currentRoute)}
  
            <!-- Dynamic View Container -->
            <main id="main-view-container" class="flex-1 overflow-x-hidden">
              ${this.getViewHtml()}
            </main>
          </div>
  
          <!-- Mobile Bottom Navigation Bar -->
          ${renderMobileNav(this.currentRoute)}
        </div>
      `;
  
      syncLayoutVars();
      this.attachGlobalShellListeners();
      this.initCurrentView();
    }
  
    getViewHtml() {
      switch (this.currentRoute) {
        case "dashboard":
          return renderDashboard();
        case "assistant":
          return renderAssistant(this.routeParams.initialQuery || "");
        case "campusMap":
          return renderCampusMap(this.routeParams.selectedBuildingId || "bld-34");
        case "lostFound":
          return renderLostFound();
        case "spaces":
          return renderSpaces();
        case "events":
          return renderEvents();
        case "profile":
          return renderProfile();
        case "admin":
          return renderAdmin();
        default:
          return renderDashboard();
      }
    }
  
    initCurrentView() {
      switch (this.currentRoute) {
        case "dashboard":
          this.activeCleanup = initDashboardListeners((route, params) => this.navigate(route, params));
          break;
        case "assistant":
          initAssistantListeners((route, params) => this.navigate(route, params), this.routeParams.initialQuery || "");
          break;
        case "campusMap":
          initCampusMapListeners(this.routeParams.selectedBuildingId || "bld-34");
          break;
        case "lostFound":
          initLostFoundListeners();
          break;
        case "spaces":
          initSpacesListeners((route, params) => this.navigate(route, params));
          break;
        case "events":
          initEventsListeners();
          break;
        case "profile":
          initProfileListeners();
          break;
        case "admin":
          initAdminListeners((route, params) => this.navigate(route, params));
          break;
      }
    }
  
    closeMenus(exceptMenuId = null) {
      APP_MENU_PAIRS.forEach(([triggerId, menuId]) => {
        if (menuId === exceptMenuId) return;
        const menu = document.getElementById(menuId);
        const trigger = document.getElementById(triggerId);
        if (menu) menu.classList.add("hidden");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
    }
  
    bindMenu(triggerId, menuId) {
      const trigger = document.getElementById(triggerId);
      const menu = document.getElementById(menuId);
      if (!trigger || !menu) return;
      trigger.setAttribute("aria-expanded", "false");
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const willOpen = menu.classList.contains("hidden");
        this.closeMenus(willOpen ? menuId : null);
        menu.classList.toggle("hidden", !willOpen);
        trigger.setAttribute("aria-expanded", String(willOpen));
        const first = menu.querySelector(".up-menu-item");
        if (willOpen && first && e.detail === 0) first.focus();
      });
      if (trigger.tagName !== "BUTTON") {
        trigger.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); trigger.click(); }
        });
      }
    }
  
    bindAccountMenu(triggerId, menuId) {
      this.bindMenu(triggerId, menuId);
      const menu = document.getElementById(menuId);
      if (!menu) return;
      menu.querySelectorAll("[data-menu-route]").forEach(item => {
        item.addEventListener("click", () => this.navigate(item.dataset.menuRoute));
      });
      const logout = menu.querySelector("[data-menu-logout]");
      if (logout) {
        logout.addEventListener("click", () => {
          this.closeMenus();
          auth.logout();
          window.location.hash = "";
          window.location.reload();
        });
      }
    }
  
    attachGlobalShellListeners() {
      // Sidebar collapse toggle
      const collapseBtn = document.getElementById("sidebar-collapse-btn");
      if (collapseBtn) {
        collapseBtn.addEventListener("click", () => {
          this.sidebarCollapsed = !this.sidebarCollapsed;
          this.render();
        });
      }
  
      // Brand Logo Click -> Dashboard
      const brandLogo = document.getElementById("brand-logo-btn");
      if (brandLogo) {
        brandLogo.addEventListener("click", () => this.navigate("dashboard", { isAdminMode: false }));
      }
  
      // Sidebar Navigation Buttons
      document.querySelectorAll(".nav-link-btn, .mobile-nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const route = btn.dataset.route;
          if (route) {
            this.navigate(route);
          }
        });
      });
  
      // Toggle Role Mode Switcher (Student <-> Admin)
      const toggleRoleBtn = document.getElementById("toggle-role-mode-btn");
      if (toggleRoleBtn) {
        toggleRoleBtn.addEventListener("click", () => {
          if (this.isAdminMode) {
            this.navigate("dashboard", { isAdminMode: false });
            toasts.show({
              title: "Student View Active",
              message: "Switched to standard student profile.",
              type: "info"
            });
          } else {
            this.navigate("admin", { isAdminMode: true });
            toasts.show({
              title: "Admin Console Active",
              message: "Access granted for Campus Operations & Facilities auditing.",
              type: "success"
            });
          }
        });
      }
  
      // Account menus (sidebar card on desktop, header avatar on mobile)
      this.bindAccountMenu("sidebar-profile-trigger", "sidebar-profile-menu");
      this.bindAccountMenu("header-avatar-btn", "header-profile-menu");
  
      // Header chat shortcut -> AI Assistant
      const chatBtn = document.getElementById("header-chat-btn");
      if (chatBtn) chatBtn.addEventListener("click", () => this.navigate("assistant"));
  
      // Sidebar: slide-down "Campus" group + report shortcut
      const groupBtn = document.getElementById("nav-group-btn");
      const groupBody = document.getElementById("nav-group-body");
      if (groupBtn && groupBody) {
        groupBtn.addEventListener("click", () => {
          const isOpen = groupBody.classList.toggle("open");
          groupBtn.classList.toggle("open", isOpen);
          setSidebarGroupOpen(isOpen);
        });
      }
      const reportBtn = document.getElementById("sidebar-report-btn");
      if (reportBtn) reportBtn.addEventListener("click", () => modals.openLostReportModal());
  
      // Global Search Trigger in Header
      const searchTrigger = document.getElementById("global-search-trigger");
      if (searchTrigger) {
        searchTrigger.addEventListener("click", () => this.openGlobalSearch());
      }
  
      // Header dropdowns: theme + notifications
      this.bindMenu("theme-toggle-btn", "theme-toggle-dropdown");
      const themeMenu = document.getElementById("theme-toggle-dropdown");
      if (themeMenu) {
        themeMenu.querySelectorAll(".theme-option-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            setThemePreference(btn.dataset.themeOption);
            this.render();
          });
        });
      }
      this.bindMenu("notifications-btn", "notifications-dropdown");
      const notifMatchItem = document.getElementById("notif-match-item");
      if (notifMatchItem) {
        notifMatchItem.addEventListener("click", () => {
          this.closeMenus();
          modals.openMatchResultModal(lostAndFoundItems.activeMatch);
        });
      }
    }
  }
  
  // Instantiate and start app on DOM content loaded
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    window.unipulse = new UniPulseApp();
    window.unipulse.init();
  });
  
  
  /* Publishes real header / bottom-nav heights as CSS variables so full-height
     views (Map, AI Assistant) fit exactly on phones, whatever the browser chrome does. */
  function syncLayoutVars() {
    const root = document.documentElement;
    const header = document.querySelector(".up-header");
    const nav = document.querySelector(".up-mobile-nav");
    if (header && header.offsetHeight) root.style.setProperty("--up-header-h", header.offsetHeight + "px");
    if (nav && nav.offsetHeight) root.style.setProperty("--up-nav-h", nav.offsetHeight + "px");
  }
  window.addEventListener("resize", syncLayoutVars);
  window.addEventListener("orientationchange", syncLayoutVars);

})();