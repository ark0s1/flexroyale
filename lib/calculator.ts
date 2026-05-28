import { Player, AccountValue } from '@/types/clash';

const UPGRADE_COSTS_GEMS: Record<string, number[]> = {
  Common:    [  0,   0,   0,   1,   2,   5,  10,   20,   30,   50,   80,  120,  200,  350,  500],
  Rare:      [  0,   0,   2,   8,  20,  40,  80,  150,  250,  400,  650, 1000, 1500, 2000, 2500],
  Epic:      [  0,   0,  80, 200, 400, 800,1200, 1800, 3000, 4500, 6500, 8000, 9000,10000,11000],
  Legendary: [  0, 500,1500,3500,6000,9000,13000,18000,22000,27000,32000,38000,44000,50000,60000],
  Champion:  [  0,   0,  50, 100, 200, 400, 800, 1200, 2000, 3000, 4500, 6000, 8000,10000,12000],
};

const MAX_EVOLUTIONS = 40;
const MAX_HEROES = 15;
const GEMS_PER_EURO = 130;

// Mapping leagueNumber → gems (confirmé sur données réelles)
// 1=Master I, 2=Master II, 3=Master III, 5=Champion, 6=Grand Champion, 7=Royal Champion, 8=Ultimate Champion
const LEAGUE_GEMS: Record<number, { label: string; gems: number }> = {
  1: { label: 'Master I',          gems: 500 },
  2: { label: 'Master II',         gems: 1000 },
  3: { label: 'Master III',        gems: 2000 },
  5: { label: 'Champion',          gems: 4000 },
  6: { label: 'Grand Champion',    gems: 8000 },
  7: { label: 'Royal Champion',    gems: 15000 },
  8: { label: 'Ultimate Champion', gems: 30000 },
};

function gemsToEuros(gems: number): number {
  return Math.round((gems / GEMS_PER_EURO) * 100) / 100;
}

function calculateCardsValue(cards: Player['cards']): { gems: number; detail: string } {
  let totalGems = 0;
  let maxCards = 0;
  let nearMaxCards = 0;
  let solidCards = 0;

  cards.forEach(card => {
    const rarity = card.rarity;
    const level = card.level || 1;
    const cardMaxLevel = card.maxLevel || 14;
    const costs = UPGRADE_COSTS_GEMS[rarity] || UPGRADE_COSTS_GEMS.Common;

    for (let i = 1; i < Math.min(level, costs.length); i++) {
      totalGems += costs[i];
    }

    if (level >= cardMaxLevel)            maxCards++;
    else if (level >= cardMaxLevel - 1)   nearMaxCards++;
    else if (level >= cardMaxLevel - 2)   solidCards++;
  });

  return {
    gems: totalGems,
    detail: `${maxCards} cartes max · ${nearMaxCards} max-1 · ${solidCards} max-2`,
  };
}

function calculateEvolutionsValue(cards: Player['cards']): { gems: number; detail: string } {
  const count = Math.min(cards.filter(c => (c.evolutionLevel || 0) > 0).length, MAX_EVOLUTIONS);
  return { gems: count * 2500, detail: `${count} évolutions débloquées` };
}

function calculateHeroesValue(cards: Player['cards']): { gems: number; detail: string } {
  const count = Math.min(cards.filter(c => c.iconUrls?.heroMedium).length, MAX_HEROES);
  return { gems: count * 1500, detail: `${count} Héros débloqués` };
}

function calculateKingLevelValue(expLevel: number): { gems: number; detail: string } {
  return { gems: expLevel * 400, detail: `King Level ${expLevel} (XP accumulée)` };
}

function calculateTrophiesValue(trophies: number): { gems: number; detail: string } {
  const base = Math.floor(trophies / 1000) * 1000;
  const bonus = trophies >= 9000 ? 5000 : trophies >= 8000 ? 2500 : trophies >= 7000 ? 1000 : 0;
  return {
    gems: base + bonus,
    detail: `${trophies.toLocaleString('fr-FR')} trophées max`,
  };
}

function calculateCosmeticsValue(player: Player): { gems: number; detail: string } {
  const badgeCount = player.badges?.length || 0;
  return { gems: badgeCount * 300, detail: `${badgeCount} badges · cosmétiques estimés` };
}

function calculateAncienneteValue(player: Player): { gems: number; detail: string } {
  const battles = player.battleCount || 0;
  return {
    gems: Math.floor(battles / 1000) * 500,
    detail: `${battles.toLocaleString('fr-FR')} batailles jouées`,
  };
}

function calculateRankedValue(player: Player): { gems: number; detail: string } {
  // On prend le MEILLEUR rang jamais atteint (bestPathOfLegendSeasonResult)
  // et le rang actuel — on retient le plus élevé des deux pour la valeur
  const bestLeague = player.bestPathOfLegendSeasonResult?.leagueNumber ?? null;
  const currentLeague = player.currentPathOfLegendSeasonResult?.leagueNumber ?? null;

  // Prendre le plus haut leagueNumber valide (hors leagueNumber 4, non utilisé)
  const candidates = [bestLeague, currentLeague].filter(
    (n): n is number => n !== null && n in LEAGUE_GEMS
  );

  if (candidates.length === 0) {
    return { gems: 0, detail: 'Ranked non joué' };
  }

  const topLeague = Math.max(...candidates);
  const entry = LEAGUE_GEMS[topLeague];

  const parts: string[] = [];
  if (bestLeague !== null && bestLeague in LEAGUE_GEMS) {
    parts.push(`Record : ${LEAGUE_GEMS[bestLeague].label}`);
  }
  if (currentLeague !== null && currentLeague in LEAGUE_GEMS && currentLeague !== bestLeague) {
    parts.push(`Actuel : ${LEAGUE_GEMS[currentLeague].label}`);
  }

  return {
    gems: entry.gems,
    detail: parts.join(' · ') || entry.label,
  };
}

function calculateFlexScore(totalGems: number, trophies: number, maxCards: number): number {
  const gemsScore = Math.min(totalGems / 150000 * 400, 400);
  const trophyScore = Math.min(trophies / 9000 * 300, 300);
  const cardsScore = Math.min(maxCards / 60 * 300, 300);
  return Math.round(gemsScore + trophyScore + cardsScore);
}

function getGrade(score: number): 'S+' | 'S' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 950) return 'S+';
  if (score >= 750) return 'S';
  if (score >= 550) return 'A';
  if (score >= 350) return 'B';
  if (score >= 150) return 'C';
  return 'D';
}

function getTopPercent(score: number): string {
  if (score >= 750) return 'Top 1%';
  if (score >= 600) return 'Top 5%';
  if (score >= 450) return 'Top 15%';
  if (score >= 300) return 'Top 35%';
  if (score >= 150) return 'Top 60%';
  return 'Top 80%';
}

function getArchetype(player: Player, score: number): { archetype: string; emoji: string } {
  const maxCards = player.cards?.filter(c => c.level >= c.maxLevel).length || 0;
  const evolvedCards = player.cards?.filter(c => (c.evolutionLevel || 0) > 0).length || 0;

  if (score >= 750 && maxCards > 50) return { archetype: 'GOATed Whale', emoji: '🐋' };
  if (score >= 600) return { archetype: 'End-Game Elite', emoji: '👑' };
  if (score >= 450 && evolvedCards > 20) return { archetype: 'Evo Collector', emoji: '⚡' };
  if (score >= 350) return { archetype: 'High Ladder Grinder', emoji: '🏆' };
  if (score >= 200) return { archetype: 'Mid-Game Solid', emoji: '⚔️' };
  return { archetype: 'Early Journey', emoji: '🌱' };
}

export function calculateAccountValue(player: Player): AccountValue {
  const cardsData      = calculateCardsValue(player.cards || []);
  const evolutionsData = calculateEvolutionsValue(player.cards || []);
  const heroesData     = calculateHeroesValue(player.cards || []);
  const kingLevelData  = calculateKingLevelValue(player.expLevel || 1);
  const trophiesData   = calculateTrophiesValue(player.bestTrophies || player.trophies || 0);
  const cosmeticsData  = calculateCosmeticsValue(player);
  const ancienneteData = calculateAncienneteValue(player);
  const rankedData     = calculateRankedValue(player);

  const totalGems =
    cardsData.gems +
    evolutionsData.gems +
    heroesData.gems +
    kingLevelData.gems +
    trophiesData.gems +
    cosmeticsData.gems +
    ancienneteData.gems +
    rankedData.gems;

  const totalEuros = gemsToEuros(totalGems);

  const maxCards = player.cards?.filter(c => c.level >= c.maxLevel).length || 0;
  const flexScore = calculateFlexScore(totalGems, player.bestTrophies || player.trophies || 0, maxCards);

  return {
    totalEuros,
    totalGems,
    flexGrade: getGrade(flexScore),
    flexScore,
    topPercent: getTopPercent(flexScore),
    ...getArchetype(player, flexScore),
    archetypeEmoji: getArchetype(player, flexScore).emoji,
    archetype: getArchetype(player, flexScore).archetype,
    breakdown: {
      cards:      { value: gemsToEuros(cardsData.gems),      gems: cardsData.gems,      label: '🃏 Niveaux des cartes',    detail: cardsData.detail },
      evolutions: { value: gemsToEuros(evolutionsData.gems), gems: evolutionsData.gems, label: '⚡ Évolutions',            detail: evolutionsData.detail },
      heroes:     { value: gemsToEuros(heroesData.gems),     gems: heroesData.gems,     label: '🦸 Héros',                 detail: heroesData.detail },
      kingLevel:  { value: gemsToEuros(kingLevelData.gems),  gems: kingLevelData.gems,  label: '👑 King Level & XP',       detail: kingLevelData.detail },
      trophies:   { value: gemsToEuros(trophiesData.gems),   gems: trophiesData.gems,   label: '🏆 Trophées',              detail: trophiesData.detail },
      cosmetics:  { value: gemsToEuros(cosmeticsData.gems),  gems: cosmeticsData.gems,  label: '🎨 Cosmétiques & Badges',  detail: cosmeticsData.detail },
      anciennete: { value: gemsToEuros(ancienneteData.gems), gems: ancienneteData.gems, label: '⏳ Ancienneté & Temps',    detail: ancienneteData.detail },
      ranked:     { value: gemsToEuros(rankedData.gems),     gems: rankedData.gems,     label: '🏅 Ranked Mode',           detail: rankedData.detail },
    },
  };
}
