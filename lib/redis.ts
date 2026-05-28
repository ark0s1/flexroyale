import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

// Null si env vars absentes — les callers gèrent via try/catch
export const redis: Redis | null =
  url && token ? new Redis({ url, token }) : null;

export const LEADERBOARD_KEY = 'leaderboard:v1';
export const LEADERBOARD_MAX = 100;

export interface LeaderboardEntry {
  tag: string;
  name: string;
  grade: string;
  archetype: string;
  archetypeEmoji: string;
  trophies: number;
  value: number;
}