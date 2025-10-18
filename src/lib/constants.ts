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
    name: "Technical Judge",
    role: "Senior Engineer",
    style: "Analytical, detail-oriented, loves clean code",
    focus: "Technical feasibility, architecture, scalability",
    voicePersona: "Tech Bro 3000"
  },
  {
    name: "Business Judge",
    role: "VC Partner",
    style: "Market-focused, ROI-driven, loves big numbers",
    focus: "Market size, business model, competitive advantage",
    voicePersona: "Brutal VC"
  },
  {
    name: "Creative Judge",
    role: "Design Director",
    style: "User-obsessed, aesthetic-focused, loves innovation",
    focus: "User experience, design, creativity, innovation",
    voicePersona: "Supportive Comedian"
  },
  {
    name: "Customer Support Expert",
    role: "Customer Success Director",
    style: "Empathetic, user-centric, problem-solver",
    focus: "User support, customer journey, satisfaction, retention",
    voicePersona: "Zen Mentor"
  },
  {
    name: "Generalist Judge",
    role: "Seasoned CEO",
    style: "Balanced, strategic, big-picture thinker",
    focus: "Overall viability, strategy, execution, team dynamics",
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
