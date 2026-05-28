export interface PlayerTag {
  tag: string;
}

export interface Card {
  name: string;
  id: number;
  level: number;
  maxLevel: number;
  starLevel?: number;
  evolutionLevel?: number;
  iconUrls: {
    medium: string;
    evolutionMedium?: string;
    heroMedium?: string;
  };
  rarity: string;
  count?: number;
}

export interface PathOfLegendSeasonResult {
  leagueNumber: number;
  trophies: number;
  rank: number | null;
}

export interface Player {
  tag: string;
  name: string;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  wins: number;
  losses: number;
  battleCount: number;
  threeCrownWins: number;
  challengeCardsWon: number;
  challengeMaxWins: number;
  tournamentCardsWon: number;
  tournamentBattleCount: number;
  role?: string;
  donations: number;
  donationsReceived: number;
  totalDonations: number;
  warDayWins: number;
  clanCardsCollected: number;
  clan?: {
    tag: string;
    name: string;
    badgeId: number;
  };
  arena: {
    id: number;
    name: string;
  };
  leagueStatistics?: {
    currentSeason: {
      trophies: number;
      bestTrophies?: number;
      rank?: number;
    };
    previousSeason?: {
      id: string;
      trophies: number;
      bestTrophies: number;
      rank?: number;
    };
    bestSeason?: {
      id: string;
      trophies: number;
      rank?: number;
    };
  };
  // Ranked Mode (Path of Legend) — champs réels de l'API CR
  currentPathOfLegendSeasonResult?: PathOfLegendSeasonResult;
  lastPathOfLegendSeasonResult?: PathOfLegendSeasonResult;
  bestPathOfLegendSeasonResult?: PathOfLegendSeasonResult;
  badges: Array<{
    name: string;
    level?: number;
    maxLevel?: number;
    progress?: number;
    target?: number;
    iconUrls?: { large: string };
  }>;
  achievements: Array<{
    name: string;
    stars: number;
    value: number;
    target: number;
    info: string;
  }>;
  cards: Card[];
  currentDeck: Card[];
  currentFavouriteCard?: Card;
  starPoints?: number;
  expPoints?: number;
  legendStatistics?: {
    currentSeason?: { rank: number; trophies: number; bestTrophies?: number };
    previousSeason?: { id: string; rank: number; trophies: number };
    bestSeason?: { id: string; rank: number; trophies: number };
  };
  supporterPoints?: number;
  kingTowerHitPoints?: number;
  princessTowerHitPoints?: number[];
}

export interface AccountValue {
  totalEuros: number;
  totalGems: number;
  breakdown: {
    cards:      { value: number; gems: number; label: string; detail: string };
    evolutions: { value: number; gems: number; label: string; detail: string };
    heroes:     { value: number; gems: number; label: string; detail: string };
    kingLevel:  { value: number; gems: number; label: string; detail: string };
    cosmetics:  { value: number; gems: number; label: string; detail: string };
    trophies:   { value: number; gems: number; label: string; detail: string };
    anciennete: { value: number; gems: number; label: string; detail: string };
    ranked:     { value: number; gems: number; label: string; detail: string };
  };
  flexGrade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  flexScore: number;
  topPercent: string;
  archetype: string;
  archetypeEmoji: string;
}

export interface PlayerApiResponse {
  player: Player;
  accountValue: AccountValue;
}
