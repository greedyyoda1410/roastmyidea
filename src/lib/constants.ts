export const ERROR_TYPES = {
  GENERIC: {
    category: "Generic Error",
    headline: "Our judge just dropped the mic.",
    detail: "Something went wrong behind the scenes. Try again in a few seconds.",
    tone: "light humor"
  },
  PARSE_FAIL: {
    category: "Parse / JSON fail",
    headline: "Roast interrupted mid-punchline.",
    detail: "The AI lost its train of thought — rerun to get a proper burn.",
    tone: "playful"
  },
  UNSAFE_CONTENT: {
    category: "Unsafe / moral content",
    headline: "Referee Timeout 🛑",
    detail: "This idea touches areas the AI can't roast responsibly. Rephrase your pitch so we can critique the concept, not the people.",
    tone: "empathetic, non-judgmental"
  },
  NETWORK_QUOTA: {
    category: "Network / quota issue",
    headline: "Judges are catching their breath.",
    detail: "Our servers might be full from other pitches. Give them a moment.",
    tone: "light, friendly"
  },
  VALIDATION_EMPTY: {
    category: "Validation (empty idea)",
    headline: "You didn't give us anything to roast!",
    detail: "Write a short idea first — the judges need material.",
    tone: "funny, direct"
  }
} as const;

export const JUDGE_PERSONAS = [
  {
    name: "Tech Bro 3000",
    role: "Senior Engineer",
    style: "Analytical, detail-oriented, loves clean code",
    focus: "Technical feasibility, architecture, scalability",
    expertise: "Technical side - architecture, scalability, code quality, tech stack decisions",
    voicePersona: "Tech Bro 3000"
  },
  {
    name: "Brutal VC",
    role: "VC Partner",
    style: "Market-focused, ROI-driven, loves big numbers",
    focus: "Investment, valuation, market analysis",
    expertise: "Investment and Valuation side - funding potential, market size, ROI, investor appeal",
    voicePersona: "Brutal VC"
  },
  {
    name: "Supportive Comedian",
    role: "Design Director",
    style: "User-obsessed, aesthetic-focused, loves innovation",
    focus: "Creative aspects, user experience, innovation",
    expertise: "Creative side - design, user experience, innovation, aesthetic appeal",
    voicePersona: "Supportive Comedian"
  },
  {
    name: "Zen Mentor",
    role: "Customer Success Director",
    style: "Empathetic, user-centric, problem-solver",
    focus: "Customer experience, operations, support",
    expertise: "Customer Experience and Operations side - user support, satisfaction, customer journey, operational efficiency",
    voicePersona: "Zen Mentor"
  },
  {
    name: "Middle-Aged CEO",
    role: "Seasoned CEO",
    style: "Balanced, strategic, big-picture thinker",
    focus: "Business viability, profitability, strategy",
    expertise: "Business and Profitability side - revenue model, sustainability, strategic execution, market fit",
    voicePersona: "Middle-Aged CEO"
  }
] as const;

export const THEMES = {
  TERMINAL: 'theme-terminal',
  LAB: 'theme-lab',
  GAMESHOW: 'theme-gameshow'
} as const;

export type ErrorType = keyof typeof ERROR_TYPES;
export type JudgePersona = typeof JUDGE_PERSONAS[number];
export type Theme = typeof THEMES[keyof typeof THEMES];
