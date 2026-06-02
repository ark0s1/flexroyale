'use client';

import { Player } from '@/types/clash';

interface Treasure {
  key: string;
  label: string;
  sublabel: string;
  rarity: 'Legendaire' | 'Epique' | 'Rare' | 'Peu commun';
  score: number;
  iconUrl?: string;
  icon: string;
}

const RARITY_STYLE: Record<Treasure['rarity'], { color: string; bg: string; border: string }> = {
  Legendaire: { color: '#C8902E', bg: 'rgba(200,144,46,0.10)', border: 'rgba(200,144,46,0.35)' },
  Epique: { color: '#C0573B', bg: 'rgba(192,87,59,0.10)', border: 'rgba(192,87,59,0.35)' },
  Rare: { color: '#6E8C9E', bg: 'rgba(110,140,158,0.10)', border: 'rgba(110,140,158,0.35)' },
  'Peu commun': { color: '#8A8B4A', bg: 'rgba(138,139,74,0.08)', border: 'rgba(138,139,74,0.25)' },
};

function toRarity(score: number): Treasure['rarity'] {
  if (score >= 85) return 'Legendaire';
  if (score >= 65) return 'Epique';
  if (score >= 40) return 'Rare';
  return 'Peu commun';
}

function isMasteryBadge(name: string): boolean {
  return name.startsWith('Mastery');
}

function iconForBadge(name: string): string {
  if (name.includes('Collection')) return 'bi-collection-fill';
  if (name.includes('Years')) return 'bi-hourglass-split';
  if (name.includes('Emote')) return 'bi-chat-square-heart';
  if (name.includes('Banner')) return 'bi-flag-fill';
  if (name.includes('Seasonal')) return 'bi-calendar3';
  if (name.includes('BattleWins')) return 'bi-swords';
  if (name.includes('ClanWar')) return 'bi-shield-fill';
  if (name.includes('Draft')) return 'bi-grid-3x3-gap-fill';
  return 'bi-award-fill';
}

function buildTreasures(player: Player): Treasure[] {
  const items: Treasure[] = [];

  const specialBadges = (player.badges || []).filter(b => !isMasteryBadge(b.name));
  for (const b of specialBadges) {
    const name = b.name;
    let score = 0;
    let label = name;
    let sublabel = '';
    let icon = iconForBadge(name);

    if (name === 'CollectionLevel') {
      const isMax = b.maxLevel !== undefined && b.level !== undefined && b.level >= b.maxLevel;
      score = isMax ? 98 : 70 + Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 25);
      label = 'Collection complete';
      sublabel = isMax ? 'Niveau MAX - toutes cartes collectees' : `Niveau ${b.level}/${b.maxLevel}`;
    } else if (name === 'YearsPlayed') {
      score = 60 + (b.level ?? 0) * 5;
      label = `${b.level} ans de jeu`;
      sublabel = 'Badge anciennete veteran';
    } else if (name === 'EmoteCollection') {
      score = 30 + Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 40);
      label = 'Collection d emotes';
      sublabel = `Niveau ${b.level}/${b.maxLevel}`;
    } else if (name === 'BannerCollection') {
      score = 25 + Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 45);
      label = 'Collection de bannieres';
      sublabel = `Niveau ${b.level}/${b.maxLevel}`;
    } else if (name === 'EasterEgg' || name === 'BeatingDeathBadge') {
      score = name === 'EasterEgg' ? 82 : 80;
      label = name === 'EasterEgg' ? 'Easter Egg' : 'Beating Death';
      sublabel = 'Badge exclusif';
    } else if (name.startsWith('SeasonalBadge_')) {
      const season = name.replace('SeasonalBadge_', '');
      const isMax = b.maxLevel !== undefined && b.level !== undefined && b.level >= b.maxLevel;
      score = isMax ? 70 : 50 + Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 18);
      label = `Badge Saison ${season}`;
      sublabel = isMax ? 'Niveau MAX' : `Niveau ${b.level}/${b.maxLevel}`;
    } else if (name === 'Royals2v2_2024') {
      const isMax = b.maxLevel !== undefined && b.level !== undefined && b.level >= b.maxLevel;
      score = isMax ? 75 : 55;
      label = 'Royals 2v2 2024';
      sublabel = isMax ? 'Evenement complete (MAX)' : `Niveau ${b.level}/${b.maxLevel}`;
    } else if (name === 'MegaDraftLeagueBadge') {
      score = 65;
      label = 'Mega Draft League';
      sublabel = 'Evenement competitif';
    } else if (name === 'TouchdownLeagueBadge') {
      score = 63;
      label = 'Touchdown League';
      sublabel = 'Evenement exclusif';
    } else if (name === 'BattleWins') {
      const lv = b.level ?? 0;
      score = Math.min(35 + lv * 5, 70);
      label = `${b.progress?.toLocaleString('fr-FR') ?? '?'} victoires`;
      sublabel = `Badge Victoires - Niv. ${lv}/${b.maxLevel}`;
    } else if (name === 'ClanWarWins' || name === 'Draft' || name.startsWith('2v2')) {
      score = 25 + Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 30);
      label = name;
      sublabel = `Niveau ${b.level}/${b.maxLevel}`;
    } else if (!b.level && !b.maxLevel) {
      score = 55;
      label = name;
      sublabel = 'Badge exclusif';
    } else {
      score = Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 40);
      label = name;
      sublabel = `Niveau ${b.level}/${b.maxLevel}`;
    }

    if (score < 25) continue;

    items.push({
      key: `badge-${name}`,
      label,
      sublabel,
      rarity: toRarity(score),
      score,
      iconUrl: b.iconUrls?.large,
      icon,
    });
  }

  const masteries = (player.badges || []).filter(b => isMasteryBadge(b.name));
  const maxMasteries = masteries.filter(b => b.level !== undefined && b.maxLevel !== undefined && b.level >= b.maxLevel);
  for (const m of maxMasteries.slice(0, 3)) {
    const cardName = m.name.replace('Mastery', '').replace(/([A-Z])/g, ' $1').trim();
    items.push({
      key: `mastery-${m.name}`,
      label: `${cardName} - Maitrise MAX`,
      sublabel: '10/10 - Maitrise complete',
      rarity: 'Epique',
      score: 83,
      iconUrl: m.iconUrls?.large,
      icon: 'bi-lightning-charge-fill',
    });
  }

  const LEAGUE_LABELS: Record<number, { label: string; score: number }> = {
    1: { label: 'Master I', score: 40 },
    2: { label: 'Master II', score: 50 },
    3: { label: 'Master III', score: 60 },
    5: { label: 'Champion', score: 72 },
    6: { label: 'Grand Champion', score: 82 },
    7: { label: 'Royal Champion', score: 90 },
    8: { label: 'Ultimate Champion', score: 97 },
  };
  const bestLeague = player.bestPathOfLegendSeasonResult?.leagueNumber ?? null;
  if (bestLeague !== null && bestLeague in LEAGUE_LABELS) {
    const info = LEAGUE_LABELS[bestLeague];
    items.push({
      key: 'ranked-best',
      label: `${info.label} - Record Ranked`,
      sublabel: 'Meilleur rang Ranked Mode atteint',
      rarity: toRarity(info.score),
      score: info.score,
      icon: 'bi-trophy-fill',
    });
  }

  const wins = player.challengeMaxWins ?? 0;
  if (wins >= 12) {
    items.push({ key: 'challenge-12', label: '12 Wins Challenge', sublabel: 'Score parfait en defi classique', rarity: 'Legendaire', score: 95, icon: 'bi-bullseye' });
  } else if (wins >= 10) {
    items.push({ key: 'challenge-10', label: `${wins} Wins Challenge`, sublabel: 'Excellent score en defi', rarity: 'Epique', score: 70, icon: 'bi-bullseye' });
  } else if (wins >= 8) {
    items.push({ key: 'challenge-8', label: `${wins} Wins Challenge`, sublabel: 'Bon score en defi', rarity: 'Rare', score: 45, icon: 'bi-bullseye' });
  }

  const seen = new Set<string>();
  return items
    .filter(t => { if (seen.has(t.key)) return false; seen.add(t.key); return true; })
    .sort((a, b) => b.score - a.score)
    .slice(0, 9);
}

interface Props { player: Player; }

export default function RarityRanking({ player }: Props) {
  const treasures = buildTreasures(player);
  if (treasures.length === 0) return null;

  const top3 = treasures.slice(0, 3);
  const rest = treasures.slice(3);
  const PODIUM_ORDER = [1, 0, 2];
  const PODIUM_SIZE = ['h-16', 'h-24', 'h-12'];
  const PODIUM_RANK = ['2', '1', '3'];

  return (
    <div className="glass-card p-5">
      <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-5 flex items-center gap-2">
        <i className="bi bi-gem" aria-hidden="true" />
        Tresors de ton compte
      </h3>

      <div className="flex items-end justify-center gap-3 mb-5">
        {PODIUM_ORDER.map((idx, pos) => {
          const t = top3[idx];
          if (!t) return <div key={pos} className="flex-1" />;
          const style = RARITY_STYLE[t.rarity];
          return (
            <div key={t.key} className="flex-1 flex flex-col items-center gap-1.5">
              <TreasureIcon treasure={t} style={style} size="lg" />
              <span className="text-xs font-semibold px-1.5 py-0.5" style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}>
                {t.rarity}
              </span>
              <p className="text-center text-xs font-medium text-bone leading-tight line-clamp-2 px-1">
                {t.label}
              </p>
              <div className={`w-full ${PODIUM_SIZE[pos]} flex items-center justify-center`} style={{ background: style.bg, border: `1px solid ${style.border}` }}>
                <span className="font-gaming text-lg font-bold" style={{ color: style.color }}>{PODIUM_RANK[pos]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {rest.length > 0 && (
        <div className="space-y-2">
          {rest.map((t, i) => {
            const style = RARITY_STYLE[t.rarity];
            return (
              <div key={t.key} className="flex items-center gap-3 px-3 py-2.5 border" style={{ background: style.bg, borderColor: style.border }}>
                <span className="text-gray-600 text-xs font-mono w-4 shrink-0">#{i + 4}</span>
                <TreasureIcon treasure={t} style={style} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-bone text-xs font-medium truncate">{t.label}</p>
                  <p className="text-gray-500 text-xs truncate">{t.sublabel}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 shrink-0" style={{ color: style.color, background: 'rgba(236,230,216,0.05)', border: `1px solid ${style.border}` }}>
                  {t.rarity}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TreasureIcon({ treasure, style, size }: { treasure: Treasure; style: { color: string; bg: string; border: string }; size: 'sm' | 'lg' }) {
  const box = size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const img = size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';
  const icon = size === 'lg' ? 'text-2xl' : 'text-base';

  return (
    <div className={`${box} flex items-center justify-center overflow-hidden shrink-0`} style={{ background: style.bg, border: `1.5px solid ${style.border}` }}>
      {treasure.iconUrl ? (
        <img src={treasure.iconUrl} alt={treasure.label} width={40} height={40} loading="lazy" decoding="async" className={`${img} object-contain`} />
      ) : (
        <i className={`bi ${treasure.icon} ${icon}`} aria-hidden="true" style={{ color: style.color }} />
      )}
    </div>
  );
}
