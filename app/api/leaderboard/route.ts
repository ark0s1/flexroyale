import { NextResponse } from 'next/server';
import { redis, LEADERBOARD_KEY, LeaderboardEntry } from '@/lib/redis';

export const runtime = 'edge';

export async function GET() {
  if (!redis) return NextResponse.json([], { status: 200 }); // Redis non configuré

  try {
    const raw = await redis.zrange<string[]>(LEADERBOARD_KEY, 0, 49, { rev: true });

    const entries: LeaderboardEntry[] = [];
    for (const item of raw) {
      try {
        const entry = typeof item === 'string' ? JSON.parse(item) : item;
        entries.push(entry as LeaderboardEntry);
      } catch {
        // skip malformed entries
      }
    }

    return NextResponse.json(entries, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
