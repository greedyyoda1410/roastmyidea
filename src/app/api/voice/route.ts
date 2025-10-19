import { NextRequest, NextResponse } from 'next/server';
import { getVoiceByPersona, getDefaultVoiceId } from '@/lib/voices';
import { JUDGE_PERSONAS } from '@/lib/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { text, judgeName } = await request.json();

    if (!text || !judgeName) {
      return NextResponse.json(
        { error: 'Text and judge name are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey || apiKey === 'your_elevenlabs_api_key_here') {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured', message: 'Voice synthesis requires API key' },
        { status: 503 }
      );
    }

    // Find the judge persona and get voice ID
    const judge = JUDGE_PERSONAS.find(j => j.name === judgeName);
    const voicePersona = judge?.voicePersona || "Tech Bro 3000";
    
    console.log(`[Voice API] Looking for voice for: ${voicePersona}`);
    console.log(`[Voice API] Judge found:`, judge ? 'Yes' : 'No');
    
    // Check all possible environment variables
    console.log('[Voice API] Environment variable check:');
    console.log('- VOICE_ID_TECH_BRO:', process.env.VOICE_ID_TECH_BRO ? 'SET' : 'NOT SET');
    console.log('- VOICE_ID_TECHNICAL_JUDGE:', process.env.VOICE_ID_TECHNICAL_JUDGE ? 'SET' : 'NOT SET');
    console.log('- VOICE_ID_TECHNICAL:', process.env.VOICE_ID_TECHNICAL ? 'SET' : 'NOT SET');
    console.log('- VOICE_ID_BRUTAL_VC:', process.env.VOICE_ID_BRUTAL_VC ? 'SET' : 'NOT SET');
    console.log('- VOICE_ID_BUSINESS_JUDGE:', process.env.VOICE_ID_BUSINESS_JUDGE ? 'SET' : 'NOT SET');
    console.log('- VOICE_ID_BUSINESS:', process.env.VOICE_ID_BUSINESS ? 'SET' : 'NOT SET');
    
    const voiceMapping = getVoiceByPersona();
    const voiceId = voiceMapping[voicePersona] || getDefaultVoiceId();
    
    console.log(`[Voice API] Voice mapping result for ${voicePersona}:`, voiceId ? `${voiceId.substring(0, 8)}...` : 'EMPTY');

    // Validate voice ID is configured
    if (!voiceId || voiceId.trim() === '') {
      console.error(`[Voice API] Voice ID not configured for: ${voicePersona}`);
      console.error('[Voice API] All voice mappings:', JSON.stringify(voiceMapping, null, 2));
      return NextResponse.json(
        { 
          error: 'Voice ID not configured', 
          message: `Voice synthesis is not configured for ${voicePersona}. Please check your Vercel environment variables. Expected one of: VOICE_ID_TECH_BRO, VOICE_ID_TECHNICAL_JUDGE, or VOICE_ID_TECHNICAL`,
          details: 'Check Vercel logs for which environment variables are missing'
        },
        { status: 503 }
      );
    }

    console.log(`[Voice API] Using voice ID for ${voicePersona}: ${voiceId.substring(0, 8)}...`);

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.15,
            use_speaker_boost: true
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      return NextResponse.json(
        { error: 'Voice synthesis failed', message: errorText },
        { status: response.status }
      );
    }

    // Stream the audio back to client
    const audioData = await response.arrayBuffer();
    
    return new NextResponse(audioData, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Error in /api/voice:', error);
    return NextResponse.json(
      { error: 'Voice synthesis failed' },
      { status: 500 }
    );
  }
}
