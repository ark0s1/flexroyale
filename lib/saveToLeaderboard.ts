import { redis, LEADERBOARD_KEY, LEADERBOARD_MAX, LeaderboardEntry } from './redis';
import { Player } from '@/types/clash';
import { AccountValue } from '@/types/clash';

export async function saveToLeaderboard(player: Player, accountValue: AccountValue) {
  if (!redis) return; // Redis non configuré — silencieux

  try {
    const entry: LeaderboardEntry = {
      tag: player.tag.replace('#', ''),
      name: player.name,
      grade: accountValue.flexGrade,
      archetype: accountValue.archetype,
      archetypeEmoji: accountValue.archetypeEmoji,
      trophies: player.bestTrophies || player.trophies || 0,
      value: Math.round(accountValue.totalEuros),
      addedAt: new Date().toISOString(),
    };

    // Score = valeur en euros (sorted set trié par valeur)
    await redis.zadd(LEADERBOARD_KEY, {
      score: accountValue.totalEuros,
      member: JSON.stringify(entry),
    });

    // Garde seulement les LEADERBOARD_MAX meilleurs
    const total = await redis.zcard(LEADERBOARD_KEY);
    if (total > LEADERBOARD_MAX) {
      await redis.zremrangebyrank(LEADERBOARD_KEY, 0, total - LEADERBOARD_MAX - 1);
    }
  } catch {
    // Silencieux — ne pas bloquer le chargement du profil si Redis est KO
  }
}
