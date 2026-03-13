import { archetypes } from "@/data/archetypes";
import { champions } from "@/data/champions";
import { buildAssessment, buildDisplayStats, pickInitialRoastLine } from "@/lib/result";
import type {
  Archetype,
  Champion,
  QuestionAnswer,
  QuizOutcome,
  TraitKey,
  TraitScores,
} from "@/lib/types";
import { traitKeys } from "@/lib/types";

export function createEmptyTraitScores(): TraitScores {
  return {
    ego: 0,
    greed: 0,
    chaos: 0,
    discipline: 0,
    mechanics: 0,
    tilt: 0,
    teamwork: 0,
    delusion: 0,
  };
}

export function accumulateTraitScores(answers: QuestionAnswer[]) {
  return answers.reduce((scores, answer) => {
    for (const trait of traitKeys) {
      scores[trait] += answer.weights[trait] ?? 0;
    }

    return scores;
  }, createEmptyTraitScores());
}

export function getDominantTraits(scores: TraitScores, count = 4) {
  return [...traitKeys]
    .sort((left, right) => scores[right] - scores[left])
    .slice(0, count);
}

function scoreArchetype(
  archetype: Archetype,
  scores: TraitScores,
  dominantTraits: TraitKey[],
) {
  const weightedScore = traitKeys.reduce((total, trait) => {
    return total + scores[trait] * (archetype.traitWeights[trait] ?? 0.25);
  }, 0);

  const dominantBonus = archetype.dominantTraits.reduce((total, trait, index) => {
    return total + (dominantTraits.includes(trait) ? 5 - index : 0);
  }, 0);

  return weightedScore + dominantBonus;
}

export function resolveArchetype(scores: TraitScores, dominantTraits: TraitKey[]) {
  return archetypes.reduce((best, candidate) => {
    const candidateScore = scoreArchetype(candidate, scores, dominantTraits);

    if (!best || candidateScore > best.score) {
      return { archetype: candidate, score: candidateScore };
    }

    return best;
  }, null as { archetype: Archetype; score: number } | null)?.archetype ?? archetypes[0]!;
}

export function getRecommendedChampions(
  archetype: Archetype,
  scores: TraitScores,
  dominantTraits: TraitKey[],
): Champion[] {
  return [...champions]
    .sort((left, right) => {
      const leftScore = scoreChampion(left.slug, left.personalityTags, left.archetypeMatches);
      const rightScore = scoreChampion(
        right.slug,
        right.personalityTags,
        right.archetypeMatches,
      );

      return rightScore - leftScore;
    })
    .slice(0, 5);

  function scoreChampion(
    slug: string,
    personalityTags: TraitKey[],
    archetypeMatches: string[],
  ) {
    let total = 0;

    if (archetypeMatches.includes(archetype.key)) {
      total += 10;
    }

    if (archetype.championPool.includes(slug)) {
      total += 8;
    }

    for (const tag of personalityTags) {
      total += scores[tag] * 0.4;
      if (dominantTraits.includes(tag)) {
        total += 4;
      }
    }

    return total;
  }
}

export function buildQuizOutcome(answers: QuestionAnswer[]): QuizOutcome {
  const traits = accumulateTraitScores(answers);
  const dominantTraits = getDominantTraits(traits);
  const archetype = resolveArchetype(traits, dominantTraits);
  const recommendedChampions = getRecommendedChampions(
    archetype,
    traits,
    dominantTraits,
  );
  const primaryChampion = recommendedChampions[0] ?? champions[0]!;
  const backupChampions = recommendedChampions.slice(1);
  const roastLine = pickInitialRoastLine(archetype.roastPool, traits, dominantTraits);
  const assessment = buildAssessment(archetype, dominantTraits, primaryChampion.name);
  const stats = buildDisplayStats(archetype, traits);

  return {
    archetype,
    traits,
    dominantTraits,
    primaryChampion,
    backupChampions,
    roastLine,
    assessment,
    stats,
  };
}
