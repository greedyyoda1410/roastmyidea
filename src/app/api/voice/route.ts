import { NextRequest, NextResponse } from 'next/server';
import { VOICE_BY_PERSONA, DEFAULT_VOICE_ID } from '@/lib/voices';
import { JUDGE_PERSONAS } from '@/lib/constants';

export const runtime = 'edge';
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
    const voiceId = VOICE_BY_PERSONA[voicePersona] || DEFAULT_VOICE_ID;

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
