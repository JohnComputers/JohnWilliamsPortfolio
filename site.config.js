window.PROJECT_HUB_CONFIG = {
  // Core GitHub account
  github: {
    owner: "JohnComputers",
    profileUrl: "https://github.com/JohnComputers",
    reposPerPage: 100
  },

  // Branding and copy
  brand: {
    name: "John's Project Hub",
    shortName: "JC",
    eyebrow: "JohnComputers",
    heroKicker: "BUILD • SHIP • REPEAT",
    heroTitle: "Everything I build, in one place.",
    heroSubtitle: "Apps, tools, experiments, games, websites, and school projects — searchable and ready to open.",
    aboutTitle: "Built to stay current.",
    aboutText: "This site pulls public repository data directly from GitHub, then applies a custom configuration for featured projects, categories, descriptions, launch links, and appearance.",
    footerText: "Built from GitHub."
  },

  // Theme. Any valid CSS color works.
  theme: {
    mode: "dark",
    accent: "#7c8cff",
    accent2: "#42d6b5",
    background: "#090b10",
    surface: "#11141c",
    surface2: "#171b25",
    text: "#f5f7fb",
    muted: "#9ba6b7",
    border: "#252b39",
    cardRadius: 22,
    maxWidth: 1240,
    cardMinWidth: 280
  },

  // Controls what appears automatically from GitHub.
  repositoryRules: {
    includeArchived: false,
    includeForks: false,
    includeEmpty: false,
    showSourceButton: true,
    showLiveButton: true,
    hideRepositories: [
      "TestChatbot",
      "Claude_Cloud_Session"
    ],
    // If true, GitHub's has_pages flag or homepage field creates a Launch button.
    autoDetectLiveSites: true
  },

  // Repositories shown first and tagged Featured.
  featured: [
    "M.E.G.A.Website",
    "PromptLab",
    "FAMATStudentStats",
    "UpdatedMAOTimers",
    "VoxelCraft",
    "Car_Scanner_AI",
    "MAO-Management_John",
    "math-tutoring"
  ],

  // Category order and keyword rules. Add/remove categories freely.
  categories: [
    {
      name: "AI",
      icon: "✦",
      keywords: ["ai", "prompt", "mega", "scanner", "leadfinder", "claude"]
    },
    {
      name: "Math & School",
      icon: "∑",
      keywords: ["famat", "mao", "math", "doral", "student", "tutoring", "history"]
    },
    {
      name: "Finance",
      icon: "$",
      keywords: ["finance", "budget", "mortgage", "loan", "interest", "credit", "gold"]
    },
    {
      name: "Games",
      icon: "◆",
      keywords: ["game", "poker", "pool", "trivia", "arena", "lantern", "voxel", "obscura"]
    },
    {
      name: "Business",
      icon: "↗",
      keywords: ["agency", "lead", "venture", "studio", "website", "plumbing", "roofing", "hvac", "brightsite"]
    },
    {
      name: "Tools",
      icon: "⌘",
      keywords: ["generator", "converter", "calculator", "tool", "splitter", "palette", "resume", "qr", "password"]
    }
  ],

  // Per-project overrides. Anything here wins over automatic GitHub data.
  // Supported fields:
  // title, description, category, icon, launchUrl, hideLaunch, hidden, tags[]
  projectOverrides: {
    "M.E.G.A.Website": {
      title: "M.E.G.A.",
      description: "Website for M.E.G.A., the Machine Enhanced General Assistant.",
      category: "AI",
      icon: "M"
    },
    "UpdatedMAOTimers": {
      title: "MAO Timers",
      description: "Competition timers built for Mu Alpha Theta events.",
      category: "Math & School",
      icon: "⏱"
    },
    "FAMATStudentStats": {
      title: "FAMAT Student Stats",
      category: "Math & School",
      icon: "∑"
    },
    "PromptLab": {
      title: "PromptLab",
      category: "AI",
      icon: "✦"
    },
    "Car_Scanner_AI": {
      title: "Car Scanner AI",
      category: "AI",
      icon: "◈"
    },
    "math-tutoring": {
      title: "Math Tutoring",
      category: "Math & School",
      icon: "π"
    }
  },

  // Text labels can be changed without editing HTML.
  labels: {
    browse: "Browse projects",
    github: "GitHub",
    launch: "Launch",
    source: "GitHub",
    allProjects: "All projects",
    liveSites: "Live sites",
    featured: "Featured"
  },

  // Advanced: inject your own CSS overrides here.
  customCss: ""
};