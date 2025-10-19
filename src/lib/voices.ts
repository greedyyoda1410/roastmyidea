// Voice ID mappings for ElevenLabs TTS
// Maps judge voice personas to ElevenLabs voice IDs
// Lazy initialization to avoid build-time errors

export function getVoiceByPersona(): Record<string, string> {
  return {
    // New names with fallback to old environment variable names for backwards compatibility
    "Tech Bro 3000": process.env.VOICE_ID_TECH_BRO || process.env.VOICE_ID_TECHNICAL_JUDGE || process.env.VOICE_ID_TECHNICAL || "",
    "Brutal VC": process.env.VOICE_ID_BRUTAL_VC || process.env.VOICE_ID_BUSINESS_JUDGE || process.env.VOICE_ID_BUSINESS || "",
    "Supportive Comedian": process.env.VOICE_ID_SUPPORTIVE_COMEDIAN || process.env.VOICE_ID_CREATIVE_JUDGE || process.env.VOICE_ID_CREATIVE || "",
    "Zen Mentor": process.env.VOICE_ID_ZEN_MENTOR || process.env.VOICE_ID_CUSTOMER_SUPPORT || process.env.VOICE_ID_SUPPORT || "",
    "Middle-Aged CEO": process.env.VOICE_ID_CEO || process.env.VOICE_ID_GENERALIST_JUDGE || process.env.VOICE_ID_GENERALIST || "",
  };
}

// Fallback voice if persona not found
export function getDefaultVoiceId(): string {
  return process.env.VOICE_ID_TECH_BRO || process.env.VOICE_ID_TECHNICAL_JUDGE || process.env.VOICE_ID_TECHNICAL || "";
}

