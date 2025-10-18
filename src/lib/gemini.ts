import { GoogleGenerativeAI } from '@google/generative-ai';
import { type ToneMatrix, type JudgeResponse } from '@/types';
import { JUDGE_PERSONAS } from './constants';

// Lazy initialization to avoid build-time errors
function getGenAI() {
  return new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
}

export async function generateRoast(
  idea: string,
  tone: ToneMatrix,
  persona: typeof JUDGE_PERSONAS[number],
  agentAnalysis?: string
): Promise<JudgeResponse> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are ${persona.name}, a ${persona.role} at a hackathon judging panel.

CONTEXT:
Startup Idea: "${idea}"

${agentAnalysis ? `\nADDITIONAL CONTEXT FROM AGENTS:\n${agentAnalysis}` : ''}

TONE PARAMETERS:
- Humor Level: ${tone.humor} (0-1, where 0 is serious and 1 is very funny)
- Sarcasm Level: ${tone.sarcasm} (-1 to 1, where -1 is supportive, 0 is neutral, 1 is very sarcastic)

RESPONSE FORMAT:
You must respond with a valid JSON object in exactly this format:
{
  "scores": {
    "originality": 0-10,
    "feasibility": 0-10,
    "wow_factor": 0-10,
    "market_potential": 0-10
  },
  "roast": "Your witty, insightful roast here...",
  "feedback": "Constructive feedback here...",
  "verdict": "PASS" | "FAIL" | "MAYBE"
}

Style: ${persona.style}
Focus: ${persona.focus}

Guidelines:
- Be creative and engaging in your roast while staying constructive
- Adjust your humor and sarcasm based on the tone parameters
- Provide honest but fair scoring (0-10 scale)
- Give actionable feedback
- Make your verdict based on the overall potential
- Keep the roast under 200 words
- Keep the feedback under 150 words
- Be entertaining but professional

Respond with ONLY the JSON object, no additional text.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedResponse = JSON.parse(cleanedText);
    
    // Validate the response structure
    if (!parsedResponse.scores || !parsedResponse.roast || !parsedResponse.feedback || !parsedResponse.verdict) {
      throw new Error('Invalid response structure from Gemini');
    }
    
    return parsedResponse as JudgeResponse;
  } catch (error) {
    console.error('Error generating roast:', error);
    throw new Error('Failed to generate roast');
  }
}

export async function moderateContent(idea: string): Promise<boolean> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
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
