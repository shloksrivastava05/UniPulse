/**
 * UniPulse Campus Dataset & Mock Store
 * High-fidelity, realistic university data for a world-class smart campus platform.
 */

export const mockUser = {
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

export const campusBuildings = [
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

export const studySpaces = [
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

export const campusEvents = [
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

export const lostAndFoundItems = {
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

export const adminMetrics = {
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

export const aiKnowledgeBase = {
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


export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
