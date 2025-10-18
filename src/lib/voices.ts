// Voice ID mappings for ElevenLabs TTS
// Maps judge voice personas to ElevenLabs voice IDs

export const VOICE_BY_PERSONA: Record<string, string> = {
  "Tech Bro 3000": process.env.VOICE_ID_TECH_BRO || "",
  "Brutal VC": process.env.VOICE_ID_BRUTAL_VC || "",
  "Supportive Comedian": process.env.VOICE_ID_SUPPORTIVE_COMEDIAN || "",
  "Zen Mentor": process.env.VOICE_ID_ZEN_MENTOR || "",
  "Middle-Aged CEO": process.env.VOICE_ID_CEO || "",
};

// Fallback voice if persona not found
export const DEFAULT_VOICE_ID = process.env.VOICE_ID_TECH_BRO || "";

