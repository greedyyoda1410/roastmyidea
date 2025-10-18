import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leaderboard } from '@/lib/db/schema';
import { desc, sql } from 'drizzle-orm';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const timeFilter = searchParams.get('time') || 'all'; // all, today, week

    // Build query based on time filter
    let results;
    
    if (timeFilter === 'today') {
      results = await db
        .select()
        .from(leaderboard)
        .where(sql`${leaderboard.createdAt} >= NOW() - INTERVAL '1 day'`)
        .orderBy(desc(leaderboard.totalScore))
        .limit(Math.min(limit, 100));
    } else if (timeFilter === 'week') {
      results = await db
        .select()
        .from(leaderboard)
        .where(sql`${leaderboard.createdAt} >= NOW() - INTERVAL '7 days'`)
        .orderBy(desc(leaderboard.totalScore))
        .limit(Math.min(limit, 100));
    } else {
      results = await db
        .select()
        .from(leaderboard)
        .orderBy(desc(leaderboard.totalScore))
        .limit(Math.min(limit, 100));
    }

    return NextResponse.json({
      success: true,
      leaderboard: results,
      count: results.length
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
