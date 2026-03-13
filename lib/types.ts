export const traitKeys = [
  "ego",
  "greed",
  "chaos",
  "discipline",
  "mechanics",
  "tilt",
  "teamwork",
  "delusion",
] as const;

export type TraitKey = (typeof traitKeys)[number];

export type TraitScores = Record<TraitKey, number>;

export const displayStatKeys = [
  "tiltResistance",
  "egoDensity",
  "greedIndex",
  "mapAwareness",
  "teamCooperation",
] as const;

export type DisplayStatKey = (typeof displayStatKeys)[number];

export interface QuestionAnswer {
  id: string;
  label: string;
  flavor: string;
  weights: Partial<TraitScores>;
}

export interface Question {
  id: string;
  prompt: string;
  answers: QuestionAnswer[];
}

export interface Champion {
  slug: string;
  name: string;
  riotId: string;
  roles: string[];
  personalityTags: TraitKey[];
  archetypeMatches: string[];
  fantasy: string;
}

export interface Archetype {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  roastPool: string[];
  dominantTraits: TraitKey[];
  traitWeights: Partial<Record<TraitKey, number>>;
  statProfile: Record<DisplayStatKey, number>;
  championPool: string[];
}

export interface DisplayStat {
  key: DisplayStatKey;
  label: string;
  value: number;
}

export interface QuizOutcome {
  archetype: Archetype;
  traits: TraitScores;
  dominantTraits: TraitKey[];
  primaryChampion: Champion;
  backupChampions: Champion[];
  roastLine: string;
  assessment: string;
  stats: DisplayStat[];
}
