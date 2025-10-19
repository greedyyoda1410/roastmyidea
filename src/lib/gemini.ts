import { GoogleGenerativeAI } from '@google/generative-ai';
import { type ToneMatrix, type JudgeResponse } from '@/types';
import { JUDGE_PERSONAS } from './constants';

// Lazy initialization to avoid build-time errors
function getGenAI() {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.error('[Gemini] GOOGLE_API_KEY is missing from environment variables');
    throw new Error('GOOGLE_API_KEY environment variable is not set');
  }
  
  console.log('[Gemini] API key present, length:', apiKey.length);
  return new GoogleGenerativeAI(apiKey);
}

export async function generateRoast(
  idea: string,
  tone: ToneMatrix,
  persona: typeof JUDGE_PERSONAS[number],
  agentAnalysis?: string
): Promise<JudgeResponse> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
You are ${persona.name}, a ${persona.role} at a hackathon judging panel.

YOUR EXPERTISE: ${persona.expertise}

CRITICAL INSTRUCTION: Your feedback MUST focus EXCLUSIVELY on your area of expertise. Do NOT comment on areas outside your specialty. Stay in your lane!

STARTUP IDEA:
"${idea}"

${agentAnalysis ? `\nADDITIONAL CONTEXT FROM AGENTS:\n${agentAnalysis}` : ''}

TONE PARAMETERS - ADJUST YOUR RESPONSE STYLE:
- Humor Level: ${tone.humor.toFixed(2)} (scale: 0.0 = Very Serious → 1.0 = Very Funny)
  ${tone.humor > 0.7 ? '→ Be witty and playful in your critique' : tone.humor > 0.4 ? '→ Mix professional insight with light humor' : '→ Stay serious and professional'}

- Sarcasm Level: ${tone.sarcasm.toFixed(2)} (scale: -1.0 = Very Supportive → 0.0 = Neutral → 1.0 = Very Sarcastic)
  ${tone.sarcasm > 0.5 ? '→ Use sharp sarcasm and biting wit' : tone.sarcasm > 0 ? '→ Use mild sarcasm occasionally' : tone.sarcasm > -0.5 ? '→ Stay neutral and balanced' : '→ Be encouraging and supportive'}

YOUR JUDGING STYLE: ${persona.style}
YOUR FOCUS AREAS: ${persona.focus}

RESPONSE FORMAT:
You must respond with a valid JSON object in exactly this format:
{
  "scores": {
    "originality": 0-10,
    "feasibility": 0-10,
    "wow_factor": 0-10,
    "market_potential": 0-10
  },
  "roast": "Your critique here, focused on YOUR expertise area...",
  "feedback": "Constructive feedback here, focused on YOUR expertise area...",
  "verdict": "PASS" | "FAIL" | "MAYBE"
}

SCORING GUIDELINES (from YOUR expertise perspective):
- originality: How unique is this in YOUR domain?
- feasibility: Can this work in YOUR area of expertise?
- wow_factor: Does this excite you as a ${persona.role}?
- market_potential: Your expert assessment of market viability

ROAST & FEEDBACK GUIDELINES:
- Your roast MUST be from the perspective of ${persona.expertise}
- Your feedback MUST provide actionable insights in ${persona.expertise}
- Apply the tone parameters to match the requested humor and sarcasm levels
- Keep roast under 200 words
- Keep feedback under 150 words
- Be entertaining but stay professional
- Your verdict should reflect whether this idea passes YOUR expert evaluation

Respond with ONLY the JSON object, no additional text.
`;

  try {
    console.log(`[Gemini] Generating content for ${persona.name}`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(`[Gemini] Received response, length: ${text.length}`);
    
    // Clean up the response text
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    console.log(`[Gemini] Cleaned response, attempting to parse JSON`);
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('[Gemini] JSON parse error. Raw response:', text.substring(0, 500));
      console.error('[Gemini] Cleaned response:', cleanedText.substring(0, 500));
      throw new Error(`Failed to parse Gemini response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
    
    // Validate the response structure
    if (!parsedResponse.scores || !parsedResponse.roast || !parsedResponse.feedback || !parsedResponse.verdict) {
      console.error('[Gemini] Invalid response structure:', parsedResponse);
      throw new Error('Invalid response structure from Gemini');
    }
    
    console.log(`[Gemini] Successfully generated and validated roast for ${persona.name}`);
    return parsedResponse as JudgeResponse;
  } catch (error) {
    console.error(`[Gemini] Error generating roast for ${persona.name}:`, error);
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('Gemini API authentication failed. Please check your GOOGLE_API_KEY.');
    }
    throw error;
  }
}

export async function moderateContent(idea: string): Promise<boolean> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
  const prompt = `
Analyze this startup idea for inappropriate content. Return only "SAFE" or "UNSAFE".

Startup Idea: "${idea}"

Consider inappropriate:
- Hate speech or discrimination
- Violence or harmful content
- Illegal activities
- Explicit sexual content
- Content that could harm individuals or groups

Return only "SAFE" or "UNSAFE".
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().toUpperCase();
    
    return text === 'SAFE';
  } catch (error) {
    console.error('Error moderating content:', error);
    // Default to safe if moderation fails
    return true;
  }
}
