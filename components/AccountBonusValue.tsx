'use client';

import { Player } from '@/types/clash';

const LEAGUE_MAP: Record<number, { label: string; icon: string; color: string; gems: number }> = {
  1: { label: 'Master I',          icon: 'bi-gem', color: '#6E8C9E', gems: 500 },
  2: { label: 'Master II',         icon: 'bi-gem', color: '#6E8C9E', gems: 1000 },
  3: { label: 'Master III',        icon: 'bi-gem', color: '#6E8C9E', gems: 2000 },
  5: { label: 'Champion',          icon: 'bi-trophy-fill', color: '#C8902E', gems: 4000 },
  6: { label: 'Grand Champion',    icon: 'bi-award-fill', color: '#C0573B', gems: 8000 },
  7: { label: 'Royal Champion',    icon: 'bi-stars', color: '#8A8B4A', gems: 15000 },
  8: { label: 'Ultimate Champion', icon: 'bi-lightning-charge-fill', color: '#C0573B', gems: 30000 },
};

const ROAD_TIERS = [
  { min: 0,     label: 'Arenes 1-24',       icon: 'bi-map', color: '#8A847A' },
  { min: 10000, label: 'Arene 25',          icon: 'bi-shield', color: '#9C7A5B' },
  { min: 10500, label: 'Arene 26',          icon: 'bi-shield-fill', color: '#9C7A5B' },
  { min: 11000, label: 'Arene 27',          icon: 'bi-gem', color: '#6E8C9E' },
  { min: 11500, label: 'Arene 28',          icon: 'bi-gem', color: '#6E8C9E' },
  { min: 13000, label: 'Ranked debloque',   icon: 'bi-trophy', color: '#C8902E' },
  { min: 14000, label: 'Max Trophy Road',   icon: 'bi-award', color: '#C0573B' },
];

const CHALLENGE_TIERS = [
  { min: 0,  label: 'Casual',        icon: 'bi-controller', color: '#8A847A' },
  { min: 5,  label: 'Intermediaire', icon: 'bi-swords', color: '#8A8B4A' },
  { min: 8,  label: 'Challenger',    icon: 'bi-bullseye', color: '#6E8C9E' },
  { min: 10, label: 'Pro',           icon: 'bi-fire', color: '#C8902E' },
  { min: 12, label: 'Legendaire',    icon: 'bi-stars', color: '#C0573B' },
];

const GEMS_PER_EURO = 130;
const g2e = (g: number) => Math.round(g / GEMS_PER_EURO);

interface Props { player: Player; }

export default function AccountBonusValue({ player }: Props) {
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

  const currentLeague = player.currentPathOfLegendSeasonResult?.leagueNumber ?? null;
  const currentRank = currentLeague !== null ? (LEAGUE_MAP[currentLeague] ?? null) : null;
  const bestLeague = player.bestPathOfLegendSeasonResult?.leagueNumber ?? null;
  const bestRank = bestLeague !== null ? (LEAGUE_MAP[bestLeague] ?? null) : null;
  const showRecord = bestLeague !== null && bestLeague !== currentLeague;
  const challengeWins = player.challengeMaxWins ?? 0;
  const challengeTier = [...CHALLENGE_TIERS].reverse().find(t => challengeWins >= t.min) ?? CHALLENGE_TIERS[0];

  return (
    <div className="glass-card p-5">
      <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
        <i className="bi bi-award" aria-hidden="true" />
        Prestige &amp; Ranked
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <MetricCard title="Trophy Road" icon={roadTier.icon} color={roadTier.color}>
          <p className="font-gaming font-bold text-sm leading-tight" style={{ color: roadTier.color }}>
            {roadTier.label}
          </p>
          <p className="text-gray-500 text-xs">{roadTrophies.toLocaleString('fr-FR')} / 14 000 trophees</p>
          {nextRoadTier && (
            <div className="mt-1">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{roadTier.min.toLocaleString('fr-FR')}</span>
                <span style={{ color: nextRoadTier.color }}>
                  {nextRoadTier.min.toLocaleString('fr-FR')}
                </span>
              </div>
              <div className="h-1 overflow-hidden bg-white/10">
                <div className="h-full" style={{ width: `${roadPct}%`, background: roadTier.color }} />
              </div>
            </div>
          )}
          <p className="text-gray-600 text-xs mt-1">
            {rankedUnlocked ? 'Ranked debloque' : `${(13000 - roadTrophies).toLocaleString('fr-FR')} trophees avant Ranked`}
          </p>
        </MetricCard>

        <MetricCard title="Ranked" icon={currentRank?.icon || 'bi-lock'} color={currentRank?.color || '#8A847A'}>
          {currentRank ? (
            <>
              <p className="font-gaming font-bold text-sm leading-tight" style={{ color: currentRank.color }}>
                {currentRank.label}
              </p>
              <p className="text-gray-500 text-xs">Rang actuel cette saison</p>
              <p className="text-xs font-semibold mt-1" style={{ color: currentRank.color }}>
                +{currentRank.gems.toLocaleString('fr-FR')} gems
                <span className="text-gray-500 font-normal ml-1">- ~{g2e(currentRank.gems)} EUR</span>
              </p>
            </>
          ) : (
            <>
              <p className="font-gaming font-bold text-sm text-gray-400">
                {rankedUnlocked ? 'Pas encore joue' : 'Non debloque'}
              </p>
              <p className="text-gray-500 text-xs">
                {rankedUnlocked ? 'Joue une partie Ranked pour obtenir un rang' : 'Seuil : 13 000 trophees Trophy Road'}
              </p>
            </>
          )}
        </MetricCard>
      </div>

      {showRecord && bestRank && (
        <MetricRow
          title="Record perso"
          label={bestRank.label}
          icon={bestRank.icon}
          color={bestRank.color}
          value={`+${bestRank.gems.toLocaleString('fr-FR')} gems - ~${g2e(bestRank.gems)} EUR`}
        />
      )}

      <MetricRow
        title="Competiteur"
        label={challengeTier.label}
        icon={challengeTier.icon}
        color={challengeTier.color}
        value={`${challengeWins} wins max challenge`}
      />
    </div>
  );
}

function MetricCard({ title, icon, color, children }: { title: string; icon: string; color: string; children: React.ReactNode }) {
  return (
    <div className="p-4 flex flex-col gap-1.5 border" style={{ background: `${color}10`, borderColor: `${color}40` }}>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{title}</span>
        <i className={`bi ${icon}`} aria-hidden="true" style={{ color }} />
      </div>
      {children}
    </div>
  );
}

function MetricRow({ title, label, icon, color, value }: { title: string; label: string; icon: string; color: string; value: string }) {
  return (
    <div className="p-3 flex flex-row items-center gap-3 mt-3 border" style={{ background: `${color}10`, borderColor: `${color}35` }}>
      <i className={`bi ${icon} text-lg`} aria-hidden="true" style={{ color }} />
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{title} - </span>
        <span className="font-gaming font-bold text-xs" style={{ color }}>{label}</span>
      </div>
      <span className="text-xs font-semibold text-gray-400">{value}</span>
    </div>
  );
}
