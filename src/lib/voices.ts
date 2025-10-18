// Voice ID mappings for ElevenLabs TTS
// Maps judge voice personas to ElevenLabs voice IDs
// Lazy initialization to avoid build-time errors

export function getVoiceByPersona(): Record<string, string> {
  return {
    "Tech Bro 3000": process.env.VOICE_ID_TECH_BRO || "",
    "Brutal VC": process.env.VOICE_ID_BRUTAL_VC || "",
    "Supportive Comedian": process.env.VOICE_ID_SUPPORTIVE_COMEDIAN || "",
    "Zen Mentor": process.env.VOICE_ID_ZEN_MENTOR || "",
    "Middle-Aged CEO": process.env.VOICE_ID_CEO || "",
  };
}

// Fallback voice if persona not found
export function getDefaultVoiceId(): string {
  return process.env.VOICE_ID_TECH_BRO || "";
}

