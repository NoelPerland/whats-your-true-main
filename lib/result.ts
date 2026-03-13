import type {
  Archetype,
  DisplayStat,
  DisplayStatKey,
  QuizOutcome,
  TraitKey,
  TraitScores,
} from "@/lib/types";
import { clamp } from "@/lib/utils";

export const QUIZ_RESULT_STORAGE_KEY = "true-main-quiz-result";

const displayStatLabels: Record<DisplayStatKey, string> = {
  tiltResistance: "Tilt Resistance",
  egoDensity: "Ego Density",
  greedIndex: "Greed Index",
  mapAwareness: "Map Awareness",
  teamCooperation: "Team Cooperation",
};

const traitDescriptions: Record<TraitKey, string> = {
  ego: "you queue like the loading screen is your introduction trailer",
  greed: "resources always seem more urgent when your cursor is near them",
  chaos: "stability feels suspicious unless at least one fight is already breaking out",
  discipline: "you can still hear wave states and cooldown windows over the noise",
  mechanics: "your confidence rises in exact proportion to how impossible the combo looks",
  tilt: "your emotional damage threshold is lower than your surrender vote standards",
  teamwork: "you still try to make five strangers resemble a functioning unit",
  delusion: "you consider reality an early draft of the match",
};

export function buildDisplayStats(
  archetype: Archetype,
  traits: TraitScores,
): DisplayStat[] {
  return [
    {
      key: "tiltResistance",
      label: displayStatLabels.tiltResistance,
      value: clamp(
        archetype.statProfile.tiltResistance +
          traits.discipline * 3 +
          traits.teamwork * 2 -
          traits.tilt * 3,
      ),
    },
    {
      key: "egoDensity",
      label: displayStatLabels.egoDensity,
      value: clamp(
        archetype.statProfile.egoDensity +
          traits.ego * 4 +
          traits.mechanics * 2 -
          traits.teamwork,
      ),
    },
    {
      key: "greedIndex",
      label: displayStatLabels.greedIndex,
      value: clamp(
        archetype.statProfile.greedIndex +
          traits.greed * 4 +
          traits.delusion * 2 -
          traits.teamwork,
      ),
    },
    {
      key: "mapAwareness",
      label: displayStatLabels.mapAwareness,
      value: clamp(
        archetype.statProfile.mapAwareness +
          traits.discipline * 3 +
          traits.teamwork * 2 -
          traits.chaos * 3 -
          traits.ego,
      ),
    },
    {
      key: "teamCooperation",
      label: displayStatLabels.teamCooperation,
      value: clamp(
        archetype.statProfile.teamCooperation +
          traits.teamwork * 4 +
          traits.discipline * 2 -
          traits.ego * 2 -
          traits.greed,
      ),
    },
  ];
}

export function buildAssessment(
  archetype: Archetype,
  dominantTraits: TraitKey[],
  championName: string,
) {
  const first = dominantTraits[0] ?? "ego";
  const second = dominantTraits[1] ?? "discipline";

  return `${archetype.title} came back immediately. In practical terms, ${traitDescriptions[first]}, while ${traitDescriptions[second]}. ${championName} is the obvious fit because it rewards conviction, denial, and just enough execution to make the whole thing defensible.`;
}

export function pickInitialRoastLine(
  roastPool: string[],
  traits: TraitScores,
  dominantTraits: TraitKey[],
) {
  const total =
    dominantTraits.reduce((sum, trait) => sum + traits[trait], 0) +
    Object.values(traits).reduce((sum, value) => sum + value, 0);

  const index = ((total % roastPool.length) + roastPool.length) % roastPool.length;

  return roastPool[index] ?? roastPool[0] ?? "";
}

export function saveQuizOutcome(outcome: QuizOutcome) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(QUIZ_RESULT_STORAGE_KEY, JSON.stringify(outcome));
}

export function loadQuizOutcome() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(QUIZ_RESULT_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as QuizOutcome;
  } catch {
    return null;
  }
}

export function clearQuizOutcome() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(QUIZ_RESULT_STORAGE_KEY);
}
