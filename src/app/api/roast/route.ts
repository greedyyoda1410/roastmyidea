import { NextRequest, NextResponse } from 'next/server';
import { generateRoast, moderateContent } from '@/lib/gemini';
import { db } from '@/lib/db';
import { roasts } from '@/lib/db/schema';
import { type ToneMatrix } from '@/types';
import { JUDGE_PERSONAS } from '@/lib/constants';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('[Roast API] Request received');
    const { projectName, idea, tone, selectedJudge, userId, agentAnalysis } = await request.json();

    // Validate project name
    if (!projectName || typeof projectName !== 'string' || projectName.trim().length === 0) {
      console.log('[Roast API] Validation failed: Missing project name');
      return NextResponse.json(
        { error: 'VALIDATION_EMPTY', message: 'Project name is required' },
        { status: 400 }
      );
    }

    // Validate idea
    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      console.log('[Roast API] Validation failed: Missing idea');
      return NextResponse.json(
        { error: 'VALIDATION_EMPTY', message: 'Startup idea is required' },
        { status: 400 }
      );
    }

    if (!tone || typeof tone.humor !== 'number' || typeof tone.sarcasm !== 'number') {
      console.log('[Roast API] Validation failed: Invalid tone');
      return NextResponse.json(
        { error: 'GENERIC' },
        { status: 400 }
      );
    }

    console.log('[Roast API] Starting content moderation');
    // Content moderation
    const isSafe = await moderateContent(idea);
    if (!isSafe) {
      console.log('[Roast API] Content moderation failed: Unsafe content detected');
      return NextResponse.json(
        { error: 'UNSAFE_CONTENT' },
        { status: 400 }
      );
    }
    console.log('[Roast API] Content moderation passed');

    // Single judge mode - use selected judge
    console.log('[Roast API] Single judge mode - selected:', selectedJudge);
    
    // Find the selected judge persona
    const judge = JUDGE_PERSONAS.find(j => j.name === selectedJudge);
    
    if (!judge) {
      console.log('[Roast API] Invalid judge selected, defaulting to first judge');
      // Fallback to first judge if invalid name provided
      const defaultJudge = JUDGE_PERSONAS[0];
      const judgeResponse = await generateRoast(idea, tone as ToneMatrix, defaultJudge, agentAnalysis);
      console.log('[Roast API] Successfully generated roast from default judge');
      const judgeResults = [{
        name: defaultJudge.name,
        response: judgeResponse
      }];
      
      // Continue with single judge flow
      const aggregatedScores = judgeResponse.scores;
      const finalVerdict = judgeResponse.verdict;
      
      console.log('[Roast API] Saving to database');
      const roastData = {
        userId: userId || null,
        projectName: projectName,
        ideaText: idea,
        toneHumor: tone.humor,
        toneSarcasm: tone.sarcasm,
        judgesData: { judges: judgeResults },
        finalVerdict: finalVerdict,
        scores: aggregatedScores,
      };

      try {
        const [savedRoast] = await db.insert(roasts).values(roastData).returning();
        console.log('[Roast API] Successfully saved to database, ID:', savedRoast.id);

        return NextResponse.json({
          success: true,
          roast: {
            id: savedRoast.id,
            judges: judgeResults,
            finalVerdict: finalVerdict,
            aggregatedScores: aggregatedScores,
          }
        });
      } catch (dbError) {
        console.error('[Roast API] Database save failed:', dbError);
        throw dbError;
      }
    }
    
    console.log(`[Roast API] Generating roast from: ${judge.name}`);
    const judgeResponse = await generateRoast(idea, tone as ToneMatrix, judge, agentAnalysis);
    console.log('[Roast API] Successfully generated single judge roast');
    
    const judgeResults = [{
      name: judge.name,
      response: judgeResponse
    }];

    // Single judge - use their scores and verdict directly
    const aggregatedScores = judgeResponse.scores;
    const finalVerdict = judgeResponse.verdict;

    console.log('[Roast API] Saving to database');
    // Save to database
    const roastData = {
      userId: userId || null, // Optional - null for anonymous users
      projectName: projectName,
      ideaText: idea,
      toneHumor: tone.humor,
      toneSarcasm: tone.sarcasm,
      judgesData: { judges: judgeResults },
      finalVerdict: finalVerdict,
      scores: aggregatedScores,
    };

    try {
      const [savedRoast] = await db.insert(roasts).values(roastData).returning();
      console.log('[Roast API] Successfully saved to database, ID:', savedRoast.id);

      return NextResponse.json({
        success: true,
        roast: {
          id: savedRoast.id,
          judges: judgeResults,
          finalVerdict: finalVerdict,
          aggregatedScores: aggregatedScores,
        }
      });
    } catch (dbError) {
      console.error('[Roast API] Database save failed:', dbError);
      throw dbError; // Re-throw to be caught by main catch block
    }

  } catch (error) {
    console.error('Error in /api/roast:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error?.constructor?.name
    });
    
    // Handle specific error types
    if (error instanceof SyntaxError) {
      console.error('JSON parsing failed in Gemini response');
      return NextResponse.json(
        { error: 'PARSE_FAIL' },
        { status: 500 }
      );
    }
    
    if (error instanceof Error && error.message.includes('quota')) {
      console.error('API quota exceeded');
      return NextResponse.json(
        { error: 'NETWORK_QUOTA' },
        { status: 429 }
      );
    }

    // Check for Gemini API errors
    if (error instanceof Error && (
      error.message.includes('API key') || 
      error.message.includes('authentication') ||
      error.message.includes('GOOGLE_API_KEY')
    )) {
      console.error('Gemini API authentication failed');
      return NextResponse.json(
        { error: 'GENERIC', details: 'AI service authentication failed' },
        { status: 500 }
      );
    }

    // Check for database errors
    if (error instanceof Error && (
      error.message.includes('database') || 
      error.message.includes('postgres') ||
      error.message.includes('connection')
    )) {
      console.error('Database operation failed');
      return NextResponse.json(
        { error: 'GENERIC', details: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'GENERIC', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
