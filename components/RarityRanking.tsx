'use client';

/* eslint-disable @next/next/no-img-element -- icônes de cartes (CDN Clash Royale) volontairement en <img> : évite le coût + la surface de vuln de l'optimiseur d'images Vercel (cf. npm audit) ; perf via loading=lazy + dimensions. */
import { Player } from '@/types/clash';

interface Treasure {
  key: string;
  label: string;
  sublabel: string;
  rarity: 'Légendaire' | 'Épique' | 'Rare' | 'Peu commun';
  score: number;
  iconUrl?: string;
  emoji: string;
  color: string;
}

const RARITY_STYLE: Record<Treasure['rarity'], { color: string; bg: string; border: string }> = {
  Légendaire: { color: '#FBBF24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.35)' },
  Épique:     { color: '#A78BFA', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.35)' },
  Rare:       { color: '#60a5fa', bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.35)'  },
  'Peu commun': { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.25)' },
};

// Score une rareté à partir du score brut
function toRarity(score: number): Treasure['rarity'] {
  if (score >= 85) return 'Légendaire';
  if (score >= 65) return 'Épique';
  if (score >= 40) return 'Rare';
  return 'Peu commun';
}

// Badges qui ne comptent PAS comme trésors (trop courants)
const SKIP_PREFIXES = ['MasteryG', 'MasteryB', 'MasteryW', 'MasteryA', 'MasteryS',
  'MasteryF', 'MasteryE', 'MasteryH', 'MasteryI', 'MasteryK', 'MasteryL',
  'MasteryM', 'MasteryP', 'MasteryR', 'MasteryT', 'MasteryV', 'MasteryX', 'MasteryZ',
  'MasteryD', 'MasteryC', 'MasteryN', 'MasteryO', 'MasteryQ', 'MasteryU',
];

function isMasteryBadge(name: string): boolean {
  return name.startsWith('Mastery');
}

function scoreMastery(name: string, level: number, maxLevel: number): number {
  const ratio = level / maxLevel;
  let score = ratio * 50;
  if (level >= maxLevel) score += 35; // MAX → automatiquement Épique
  return Math.round(score);
}

function buildTreasures(player: Player): Treasure[] {
  const items: Treasure[] = [];

  // ── 1. BADGES SPÉCIAUX (non-Mastery) ──
  const specialBadges = (player.badges || []).filter(b => !isMasteryBadge(b.name));
  for (const b of specialBadges) {
    const name = b.name;
    let score = 0;
    let label = name;
    let sublabel = '';
    let emoji = '🎖️';

    if (name === 'CollectionLevel') {
      const isMax = b.maxLevel !== undefined && b.level !== undefined && b.level >= b.maxLevel;
      score = isMax ? 98 : 70 + Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 25);
      label = 'Collection Complète';
      sublabel = isMax ? 'Niveau MAX — toutes cartes collectées' : `Niveau ${b.level}/${b.maxLevel}`;
      emoji = '🃏';
    } else if (name === 'YearsPlayed') {
      score = 60 + (b.level ?? 0) * 5;
      label = `${b.level} ans de jeu`;
      sublabel = 'Badge ancienneté vétéran';
      emoji = '🕰️';
    } else if (name === 'EmoteCollection') {
      score = 30 + Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 40);
      label = 'Collection d\'Emotes';
      sublabel = `Niveau ${b.level}/${b.maxLevel}`;
      emoji = '😂';
    } else if (name === 'BannerCollection') {
      score = 25 + Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 45);
      label = 'Collection de Bannières';
      sublabel = `Niveau ${b.level}/${b.maxLevel}`;
      emoji = '🚩';
    } else if (name === 'EasterEgg') {
      score = 82;
      label = 'Easter Egg';
      sublabel = 'Badge limité découverte';
      emoji = '🥚';
    } else if (name === 'BeatingDeathBadge') {
      score = 80;
      label = 'Beating Death';
      sublabel = 'Badge exclusif survie';
      emoji = '💀';
    } else if (name.startsWith('SeasonalBadge_')) {
      const season = name.replace('SeasonalBadge_', '');
      const isMax = b.maxLevel !== undefined && b.level !== undefined && b.level >= b.maxLevel;
      score = isMax ? 70 : 50 + Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 18);
      label = `Badge Saison ${season}`;
      sublabel = isMax ? 'Niveau MAX' : `Niveau ${b.level}/${b.maxLevel}`;
      emoji = '📅';
    } else if (name === 'GoblinJourney2024' || name.includes('Journey')) {
      score = 68;
      label = 'Goblin Journey 2024';
      sublabel = 'Événement exclusif 2024';
      emoji = '🧌';
    } else if (name === 'Royals2v2_2024') {
      const isMax = b.maxLevel !== undefined && b.level !== undefined && b.level >= b.maxLevel;
      score = isMax ? 75 : 55;
      label = 'Royals 2v2 2024';
      sublabel = isMax ? 'Événement complété (MAX)' : `Niveau ${b.level}/${b.maxLevel}`;
      emoji = '👑';
    } else if (name.startsWith('CrazyArena')) {
      score = 62;
      label = `Crazy Arena`;
      sublabel = 'Badge événement limité';
      emoji = '🎪';
    } else if (name === 'MegaDraftLeagueBadge') {
      score = 65;
      label = 'Mega Draft League';
      sublabel = 'Événement compétitif';
      emoji = '🎯';
    } else if (name === 'TouchdownLeagueBadge') {
      score = 63;
      label = 'Touchdown League';
      sublabel = 'Événement exclusif';
      emoji = '🏈';
    } else if (name === 'BattleWins') {
      const lv = b.level ?? 0;
      score = Math.min(35 + lv * 5, 70);
      label = `${b.progress?.toLocaleString('fr-FR') ?? '?'} victoires`;
      sublabel = `Badge Victoires — Niv. ${lv}/${b.maxLevel}`;
      emoji = '⚔️';
    } else if (name === 'ClanWarWins') {
      score = 30 + Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 30);
      label = 'Guerres de Clan';
      sublabel = `Niveau ${b.level}/${b.maxLevel}`;
      emoji = '🏰';
    } else if (name === 'Draft') {
      score = 20 + Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 30);
      label = 'Draft Master';
      sublabel = `Niveau ${b.level}/${b.maxLevel}`;
      emoji = '🎲';
    } else if (name === '2025YearBadge') {
      score = 72;
      label = 'Badge 2025';
      sublabel = 'Souvenir annuel exclusif';
      emoji = '🎆';
    } else if (name === 'MergeTacticsBadge_202506') {
      score = 58;
      label = 'Merge Tactics 2025';
      sublabel = 'Événement limité';
      emoji = '🔀';
    } else if (name.startsWith('2v2')) {
      score = 25 + Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 25);
      label = '2v2 Champion';
      sublabel = `Niveau ${b.level}/${b.maxLevel}`;
      emoji = '🤝';
    } else {
      // Badge générique — score faible selon progression
      if (!b.level && !b.maxLevel) {
        score = 55; // one-time badge sans level = exclusif
        label = name;
        sublabel = 'Badge exclusif';
      } else {
        score = Math.round(((b.level ?? 0) / (b.maxLevel ?? 1)) * 40);
        label = name;
        sublabel = `Niveau ${b.level}/${b.maxLevel}`;
      }
    }

    if (score < 25) continue; // trop bas, on skip

    items.push({
      key: `badge-${name}`,
      label,
      sublabel,
      rarity: toRarity(score),
      score,
      iconUrl: b.iconUrls?.large,
      emoji,
      color: RARITY_STYLE[toRarity(score)].color,
    });
  }

  // ── 2. MASTERIES MAX ──
  const masteries = (player.badges || []).filter(b => isMasteryBadge(b.name));
  const maxMasteries = masteries.filter(b => b.level !== undefined && b.maxLevel !== undefined && b.level >= b.maxLevel);
  if (maxMasteries.length > 0) {
    // Chaque mastery max est un trésor individuel (top 3 seulement)
    const top = maxMasteries.slice(0, 3);
    for (const m of top) {
      const cardName = m.name.replace('Mastery', '').replace(/([A-Z])/g, ' $1').trim();
      items.push({
        key: `mastery-${m.name}`,
        label: `${cardName} — Maîtrise MAX`,
        sublabel: `10/10 — Maîtrise complète`,
        rarity: 'Épique',
        score: 83,
        iconUrl: m.iconUrls?.large,
        emoji: '⚡',
        color: RARITY_STYLE['Épique'].color,
      });
    }
  }

  // ── 3. RANKED — meilleur rang all-time ──
  const LEAGUE_LABELS: Record<number, { label: string; emoji: string; score: number }> = {
    1: { label: 'Master I',          emoji: '💎', score: 40 },
    2: { label: 'Master II',         emoji: '💎', score: 50 },
    3: { label: 'Master III',        emoji: '💎', score: 60 },
    5: { label: 'Champion',          emoji: '🏆', score: 72 },
    6: { label: 'Grand Champion',    emoji: '👑', score: 82 },
    7: { label: 'Royal Champion',    emoji: '🌟', score: 90 },
    8: { label: 'Ultimate Champion', emoji: '⚡', score: 97 },
  };
  const bestLeague = player.bestPathOfLegendSeasonResult?.leagueNumber ?? null;
  if (bestLeague !== null && bestLeague in LEAGUE_LABELS) {
    const info = LEAGUE_LABELS[bestLeague];
    items.push({
      key: 'ranked-best',
      label: `${info.label} — Record Ranked`,
      sublabel: 'Meilleur rang Ranked Mode atteint',
      rarity: toRarity(info.score),
      score: info.score,
      emoji: info.emoji,
      color: RARITY_STYLE[toRarity(info.score)].color,
    });
  }

  // ── 4. CHALLENGE MAX WINS ──
  const wins = player.challengeMaxWins ?? 0;
  if (wins >= 12) {
    items.push({ key: 'challenge-12', label: '12 Wins Challenge', sublabel: 'Score parfait en défi classique', rarity: 'Légendaire', score: 95, emoji: '🎯', color: RARITY_STYLE['Légendaire'].color });
  } else if (wins >= 10) {
    items.push({ key: 'challenge-10', label: `${wins} Wins Challenge`, sublabel: 'Excellent score en défi', rarity: 'Épique', score: 70, emoji: '🎯', color: RARITY_STYLE['Épique'].color });
  } else if (wins >= 8) {
    items.push({ key: 'challenge-8', label: `${wins} Wins Challenge`, sublabel: 'Bon score en défi', rarity: 'Rare', score: 45, emoji: '🎯', color: RARITY_STYLE['Rare'].color });
  }

  // Tri par score décroissant, dédoublonnage
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

  const PODIUM_ORDER = [1, 0, 2]; // argent, or, bronze
  const PODIUM_SIZE  = ['h-16', 'h-24', 'h-12'];
  const PODIUM_RANK  = ['🥈', '🥇', '🥉'];

  return (
    <div className="glass-card p-5">
      <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-5">
        💎 Trésors de ton compte
      </h3>

      {/* ── PODIUM TOP 3 ── */}
      <div className="flex items-end justify-center gap-3 mb-5">
        {PODIUM_ORDER.map((idx, pos) => {
          const t = top3[idx];
          if (!t) return <div key={pos} className="flex-1" />;
          const style = RARITY_STYLE[t.rarity];
          return (
            <div key={t.key} className="flex-1 flex flex-col items-center gap-1.5">
              {/* Badge image ou emoji */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ background: style.bg, border: `1.5px solid ${style.border}` }}
              >
                {t.iconUrl ? (
                  <img src={t.iconUrl} alt={t.label} width={40} height={40} loading="lazy" decoding="async" className="w-10 h-10 object-contain" />
                ) : (
                  <span className="text-2xl">{t.emoji}</span>
                )}
              </div>
              {/* Étiquette rareté */}
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}>
                {t.rarity}
              </span>
              {/* Nom court */}
              <p className="text-center text-xs font-medium text-white leading-tight line-clamp-2 px-1">
                {t.label}
              </p>
              {/* Socle du podium */}
              <div
                className={`w-full ${PODIUM_SIZE[pos]} rounded-t-lg flex items-center justify-center`}
                style={{ background: style.bg, border: `1px solid ${style.border}` }}
              >
                <span className="text-lg">{PODIUM_RANK[pos]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LISTE DES AUTRES ── */}
      {rest.length > 0 && (
        <div className="space-y-2">
          {rest.map((t, i) => {
            const style = RARITY_STYLE[t.rarity];
            return (
              <div
                key={t.key}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                style={{ background: style.bg, border: `1px solid ${style.border}` }}
              >
                {/* Rang */}
                <span className="text-gray-600 text-xs font-mono w-4 shrink-0">#{i + 4}</span>

                {/* Icon */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {t.iconUrl ? (
                    <img src={t.iconUrl} alt={t.label} width={28} height={28} loading="lazy" decoding="async" className="w-7 h-7 object-contain" />
                  ) : (
                    <span className="text-base">{t.emoji}</span>
                  )}
                </div>

                {/* Texte */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{t.label}</p>
                  <p className="text-gray-500 text-xs truncate">{t.sublabel}</p>
                </div>

                {/* Badge rareté */}
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{ color: style.color, background: 'rgba(255,255,255,0.05)', border: `1px solid ${style.border}` }}
                >
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
