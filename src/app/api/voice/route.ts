import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Voice IDs for different judge personas
const VOICE_IDS = {
  'Technical Judge': 'pNInz6obpgDQGcFmaJgB', // Adam - Deep, authoritative
  'Business Judge': '21m00Tcm4TlvDq8ikWAM', // Rachel - Professional, clear
  'Creative Judge': 'EXAVITQu4vr4xnSDxMaL', // Bella - Expressive, dynamic
};

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

    const voiceId = VOICE_IDS[judgeName as keyof typeof VOICE_IDS] || VOICE_IDS['Technical Judge'];

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
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
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
