import { calculateAccountValue } from '@/lib/calculator';
import { Player } from '@/types/clash';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeCards(count: number, level: number, maxLevel: number, rarity = 'Common'): Player['cards'] {
  return Array.from({ length: count }, (_, i) => ({
    name: `Card${i}`,
    id: i,
    level,
    maxLevel,
    rarity,
    iconUrls: { medium: '' },
  }));
}

function makeBasePlayer(overrides: Partial<Player> = {}): Player {
  return {
    tag: '#TEST123',
    name: 'TestPlayer',
    expLevel: 1,
    trophies: 0,
    bestTrophies: 0,
    wins: 0,
    losses: 0,
    battleCount: 0,
    threeCrownWins: 0,
    challengeCardsWon: 0,
    challengeMaxWins: 0,
    tournamentCardsWon: 0,
    tournamentBattleCount: 0,
    donations: 0,
    donationsReceived: 0,
    totalDonations: 0,
    warDayWins: 0,
    clanCardsCollected: 0,
    arena: { id: 1, name: 'Arena 1' },
    badges: [],
    achievements: [],
    cards: [],
    currentDeck: [],
    ...overrides,
  };
}

// ─── Tests grade ───────────────────────────────────────────────────────────────

describe('Grades', () => {
  test('Compte vide → grade D, score < 150', () => {
    const player = makeBasePlayer();
    const result = calculateAccountValue(player);
    expect(result.flexGrade).toBe('D');
    expect(result.flexScore).toBeLessThan(150);
  });

  test('Score ≥ 950 → grade S+', () => {
    // Compte très développé : 100 cartes max, 9000 trophées, 150k gems cartes
    const player = makeBasePlayer({
      bestTrophies: 9000,
      expLevel: 60,
      battleCount: 50000,
      badges: Array.from({ length: 100 }, (_, i) => ({ name: `Badge${i}` })),
      cards: [
        ...makeCards(100, 14, 14, 'Common'),        // 100 cartes max Common
        ...makeCards(40, 14, 14, 'Rare'),            // 40 cartes max Rare
        ...makeCards(20, 14, 14, 'Epic'),            // 20 cartes max Epic
        ...makeCards(10, 14, 14, 'Legendary'),       // 10 cartes max Legendary
        ...makeCards(10, 14, 14, 'Champion'),        // 10 cartes max Champion
        ...Array.from({ length: 20 }, (_, i) => ({  // 20 évolutions
          name: `Evo${i}`, id: 200 + i, level: 14, maxLevel: 14,
          rarity: 'Common', evolutionLevel: 1,
          iconUrls: { medium: '' },
        })),
      ],
      currentPathOfLegendSeasonResult: { leagueNumber: 8, trophies: 9000, rank: 1 },
      bestPathOfLegendSeasonResult: { leagueNumber: 8, trophies: 9000, rank: 1 },
    });
    const result = calculateAccountValue(player);
    expect(result.flexGrade).toBe('S+');
    expect(result.flexScore).toBeGreaterThanOrEqual(950);
  });
});

// ─── Tests calcul valeur ────────────────────────────────────────────────────────

describe('Valeur totale', () => {
  test('Valeur toujours positive ou nulle', () => {
    const player = makeBasePlayer();
    const result = calculateAccountValue(player);
    expect(result.totalEuros).toBeGreaterThanOrEqual(0);
    expect(result.totalGems).toBeGreaterThanOrEqual(0);
  });

  test('totalEuros = totalGems / 130 (arrondi)', () => {
    const player = makeBasePlayer({ expLevel: 10, bestTrophies: 3000 });
    const result = calculateAccountValue(player);
    const expected = Math.round((result.totalGems / 130) * 100) / 100;
    expect(result.totalEuros).toBe(expected);
  });

  test('Pas de double comptage — la somme breakdown = totalGems', () => {
    const player = makeBasePlayer({
      bestTrophies: 5000,
      expLevel: 30,
      battleCount: 10000,
      badges: Array.from({ length: 20 }, (_, i) => ({ name: `Badge${i}` })),
      cards: makeCards(50, 14, 14, 'Common'),
    });
    const result = calculateAccountValue(player);
    const sumBreakdown = Object.values(result.breakdown).reduce((acc, v) => acc + v.gems, 0);
    expect(result.totalGems).toBe(sumBreakdown);
  });

  test('Score max plafonné à 1000', () => {
    const player = makeBasePlayer({
      bestTrophies: 99999,
      expLevel: 999,
      battleCount: 9999999,
      badges: Array.from({ length: 999 }, (_, i) => ({ name: `B${i}` })),
      cards: makeCards(200, 14, 14, 'Legendary'),
    });
    const result = calculateAccountValue(player);
    expect(result.flexScore).toBeLessThanOrEqual(1000);
  });
});

// ─── Tests évolutions ──────────────────────────────────────────────────────────

describe('Évolutions', () => {
  test('Max 40 évolutions comptées (plafond)', () => {
    const player = makeBasePlayer({
      cards: Array.from({ length: 60 }, (_, i) => ({
        name: `Evo${i}`, id: i, level: 14, maxLevel: 14,
        rarity: 'Common', evolutionLevel: 1,
        iconUrls: { medium: '' },
      })),
    });
    const result = calculateAccountValue(player);
    // 40 évolutions max × 2500 gems = 100 000 gems
    expect(result.breakdown.evolutions.gems).toBe(40 * 2500);
  });

  test('0 évolution → 0 gems évolutions', () => {
    const player = makeBasePlayer({ cards: makeCards(20, 14, 14) });
    const result = calculateAccountValue(player);
    expect(result.breakdown.evolutions.gems).toBe(0);
  });
});

// ─── Tests trophées ────────────────────────────────────────────────────────────

describe('Trophées', () => {
  test('bestTrophies pris en priorité sur trophies', () => {
    const p1 = makeBasePlayer({ trophies: 2000, bestTrophies: 7000 });
    const p2 = makeBasePlayer({ trophies: 7000, bestTrophies: 2000 });
    const r1 = calculateAccountValue(p1);
    const r2 = calculateAccountValue(p2);
    expect(r1.breakdown.trophies.gems).toBeGreaterThan(r2.breakdown.trophies.gems);
  });

  test('9000 trophées → bonus appliqué', () => {
    const playerHigh = makeBasePlayer({ bestTrophies: 9000 });
    const playerLow  = makeBasePlayer({ bestTrophies: 3000 });
    const rHigh = calculateAccountValue(playerHigh);
    const rLow  = calculateAccountValue(playerLow);
    expect(rHigh.breakdown.trophies.gems).toBeGreaterThan(rLow.breakdown.trophies.gems);
  });
});

// ─── Tests ranked mode ─────────────────────────────────────────────────────────

describe('Ranked (Path of Legend)', () => {
  test('Ranked non joué → 0 gems ranked', () => {
    const player = makeBasePlayer();
    const result = calculateAccountValue(player);
    expect(result.breakdown.ranked.gems).toBe(0);
  });

  test('Ultimate Champion (league 8) → 30 000 gems', () => {
    const player = makeBasePlayer({
      bestPathOfLegendSeasonResult: { leagueNumber: 8, trophies: 9000, rank: 1 },
    });
    const result = calculateAccountValue(player);
    expect(result.breakdown.ranked.gems).toBe(30000);
  });

  test('Prend le meilleur des deux saisons (best vs current)', () => {
    const playerBest = makeBasePlayer({
      bestPathOfLegendSeasonResult: { leagueNumber: 7, trophies: 8000, rank: 10 },
      currentPathOfLegendSeasonResult: { leagueNumber: 5, trophies: 6000, rank: 100 },
    });
    const result = calculateAccountValue(playerBest);
    // Doit prendre league 7 (Royal Champion = 15000) pas league 5 (4000)
    expect(result.breakdown.ranked.gems).toBe(15000);
  });
});

// ─── Tests ancienneté ──────────────────────────────────────────────────────────

describe('Ancienneté', () => {
  test('0 batailles → 0 gems ancienneté', () => {
    const player = makeBasePlayer({ battleCount: 0 });
    const result = calculateAccountValue(player);
    expect(result.breakdown.anciennete.gems).toBe(0);
  });

  test('1000 batailles → 500 gems', () => {
    const player = makeBasePlayer({ battleCount: 1000 });
    const result = calculateAccountValue(player);
    expect(result.breakdown.anciennete.gems).toBe(500);
  });

  test('10 000 batailles → 5000 gems', () => {
    const player = makeBasePlayer({ battleCount: 10000 });
    const result = calculateAccountValue(player);
    expect(result.breakdown.anciennete.gems).toBe(5000);
  });
});
