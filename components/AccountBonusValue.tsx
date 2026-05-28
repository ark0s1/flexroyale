'use client';

import { Player } from '@/types/clash';

/**
 * PRESTIGE & RANKED — données réelles API (mai 2026)
 *
 * Ranked Mode = Path of Legend, champs réels :
 *   currentPathOfLegendSeasonResult.leagueNumber  → rang actuel
 *   bestPathOfLegendSeasonResult.leagueNumber      → meilleur rang all-time
 *
 * Mapping leagueNumber → rang (confirmé par joueur réel PGU8V0GR8) :
 *   1=Master I  2=Master II  3=Master III  5=Champion
 *   6=Grand Champion  7=Royal Champion  8=Ultimate Champion
 */

const LEAGUE_MAP: Record<number, { label: string; emoji: string; color: string; gems: number }> = {
  1: { label: 'Master I',          emoji: '💎', color: '#60a5fa', gems: 500 },
  2: { label: 'Master II',         emoji: '💎', color: '#818CF8', gems: 1000 },
  3: { label: 'Master III',        emoji: '💎', color: '#A78BFA', gems: 2000 },
  5: { label: 'Champion',          emoji: '🏆', color: '#FBBF24', gems: 4000 },
  6: { label: 'Grand Champion',    emoji: '👑', color: '#F59E0B', gems: 8000 },
  7: { label: 'Royal Champion',    emoji: '🌟', color: '#F472B6', gems: 15000 },
  8: { label: 'Ultimate Champion', emoji: '⚡', color: '#EC4899', gems: 30000 },
};

const ROAD_TIERS = [
  { min: 0,     label: 'Arènes (1-24)',      emoji: '🏰', color: '#6B7280' },
  { min: 10000, label: 'Arène 25',           emoji: '⚔️', color: '#9CA3AF' },
  { min: 10500, label: 'Arène 26',           emoji: '⚔️', color: '#D1D5DB' },
  { min: 11000, label: 'Arène 27',           emoji: '💎', color: '#60a5fa' },
  { min: 11500, label: 'Arène 28',           emoji: '💎', color: '#818CF8' },
  { min: 13000, label: 'Ranked débloqué 🔓', emoji: '🏆', color: '#FBBF24' },
  { min: 14000, label: 'Max Trophy Road ⚡',  emoji: '👑', color: '#EC4899' },
];

const CHALLENGE_TIERS = [
  { min: 0,  label: 'Casual',        emoji: '🃏', color: '#6B7280' },
  { min: 5,  label: 'Intermédiaire', emoji: '⚔️', color: '#4ade80' },
  { min: 8,  label: 'Challenger',    emoji: '🎯', color: '#60a5fa' },
  { min: 10, label: 'Pro',           emoji: '🔥', color: '#F59E0B' },
  { min: 12, label: 'Légendaire',    emoji: '🌟', color: '#F472B6' },
];

const GEMS_PER_EURO = 130;
const g2e = (g: number) => Math.round(g / GEMS_PER_EURO);

interface Props { player: Player; }

export default function AccountBonusValue({ player }: Props) {

  // ── TROPHY ROAD ──
  const roadTrophies =
    player.leagueStatistics?.currentSeason?.trophies ??
    player.trophies ??
    0;
  const roadTier = [...ROAD_TIERS].reverse().find(t => roadTrophies >= t.min) ?? ROAD_TIERS[0];
  const nextRoadTier = ROAD_TIERS[ROAD_TIERS.indexOf(roadTier) + 1];
  const roadPct = nextRoadTier
    ? Math.min(100, Math.round(((roadTrophies - roadTier.min) / (nextRoadTier.min - roadTier.min)) * 100))
    : 100;
  const rankedUnlocked = roadTrophies >= 13000;

  // ── RANKED ACTUEL ──
  const currentLeague = player.currentPathOfLegendSeasonResult?.leagueNumber ?? null;
  const currentRank = currentLeague !== null ? (LEAGUE_MAP[currentLeague] ?? null) : null;

  // ── MEILLEUR RANG ALL-TIME ──
  const bestLeague = player.bestPathOfLegendSeasonResult?.leagueNumber ?? null;
  const bestRank = bestLeague !== null ? (LEAGUE_MAP[bestLeague] ?? null) : null;
  const showRecord = bestLeague !== null && bestLeague !== currentLeague;

  // ── COMPÉTITEUR ──
  const challengeWins = player.challengeMaxWins ?? 0;
  const challengeTier = [...CHALLENGE_TIERS].reverse().find(t => challengeWins >= t.min) ?? CHALLENGE_TIERS[0];

  return (
    <div className="glass-card p-5">
      <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-4">
        🏅 Prestige &amp; Ranked
      </h3>

      <div className="grid grid-cols-2 gap-3">

        {/* ── TROPHY ROAD ── */}
        <div
          className="rounded-xl p-4 flex flex-col gap-1.5"
          style={{
            background: `linear-gradient(135deg, ${roadTier.color}18 0%, rgba(7,7,14,0.6) 100%)`,
            border: `1px solid ${roadTier.color}40`,
          }}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">TROPHY ROAD</span>
            <span className="text-base">{roadTier.emoji}</span>
          </div>
          <p className="font-gaming font-bold text-sm leading-tight" style={{ color: roadTier.color }}>
            {roadTier.label}
          </p>
          <p className="text-gray-500 text-xs">
            {roadTrophies.toLocaleString('fr-FR')} / 14 000 trophées
          </p>
          {nextRoadTier && (
            <div className="mt-0.5">
              <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                <span>{roadTier.min.toLocaleString('fr-FR')}</span>
                <span style={{ color: nextRoadTier.color }}>
                  {nextRoadTier.label.split(' ')[0]} {nextRoadTier.min.toLocaleString('fr-FR')}
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${roadPct}%`, background: roadTier.color }} />
              </div>
            </div>
          )}
          <p className="text-gray-600 text-xs mt-0.5 italic">
            {rankedUnlocked ? 'Ranked débloqué ✅' : `${(13000 - roadTrophies).toLocaleString('fr-FR')} trophées avant Ranked`}
          </p>
        </div>

        {/* ── RANKED ACTUEL ── */}
        {currentRank ? (
          <div
            className="rounded-xl p-4 flex flex-col gap-1.5"
            style={{
              background: `linear-gradient(135deg, ${currentRank.color}18 0%, rgba(7,7,14,0.6) 100%)`,
              border: `1px solid ${currentRank.color}40`,
            }}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">RANKED</span>
              <span className="text-base">{currentRank.emoji}</span>
            </div>
            <p className="font-gaming font-bold text-sm leading-tight" style={{ color: currentRank.color }}>
              {currentRank.label}
            </p>
            <p className="text-gray-500 text-xs">Rang actuel cette saison</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: currentRank.color }}>
              +{currentRank.gems.toLocaleString('fr-FR')} gems
              <span className="text-gray-500 font-normal ml-1">· ~{g2e(currentRank.gems)} €</span>
            </p>
          </div>
        ) : (
          <div
            className="rounded-xl p-4 flex flex-col gap-1.5"
            style={{ background: 'rgba(107,114,128,0.08)', border: '1px solid rgba(107,114,128,0.2)' }}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">RANKED</span>
              <span className="text-base">{rankedUnlocked ? '🏆' : '🔒'}</span>
            </div>
            <p className="font-gaming font-bold text-sm text-gray-400">
              {rankedUnlocked ? 'Pas encore joué' : 'Non débloqué'}
            </p>
            <p className="text-gray-500 text-xs">
              {rankedUnlocked ? 'Joue une partie Ranked pour obtenir un rang' : 'Seuil : 13 000 trophées Trophy Road'}
            </p>
          </div>
        )}
      </div>

      {/* ── RECORD PERSONNEL ── */}
      {showRecord && bestRank && (
        <div
          className="rounded-xl p-3 flex flex-row items-center gap-3 mt-3"
          style={{
            background: `linear-gradient(135deg, ${bestRank.color}12 0%, rgba(7,7,14,0.4) 100%)`,
            border: `1px solid ${bestRank.color}30`,
          }}
        >
          <span className="text-lg">{bestRank.emoji}</span>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">RECORD PERSO · </span>
            <span className="font-gaming font-bold text-xs" style={{ color: bestRank.color }}>
              {bestRank.label}
            </span>
          </div>
          <span className="text-xs font-semibold" style={{ color: bestRank.color }}>
            +{bestRank.gems.toLocaleString('fr-FR')} gems
            <span className="text-gray-500 font-normal ml-1">· ~{g2e(bestRank.gems)} €</span>
          </span>
        </div>
      )}

      {/* ── COMPÉTITEUR ── */}
      <div
        className="rounded-xl p-3 flex flex-row items-center gap-3 mt-3"
        style={{
          background: `linear-gradient(135deg, ${challengeTier.color}10 0%, rgba(7,7,14,0.4) 100%)`,
          border: `1px solid ${challengeTier.color}25`,
        }}
      >
        <span className="text-lg">{challengeTier.emoji}</span>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">COMPÉTITEUR · </span>
          <span className="font-gaming font-bold text-xs" style={{ color: challengeTier.color }}>
            {challengeTier.label}
          </span>
          <span className="text-gray-500 text-xs ml-2">{challengeWins} wins max challenge</span>
        </div>
      </div>
    </div>
  );
}
