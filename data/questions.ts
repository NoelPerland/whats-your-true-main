import type { Question } from "@/lib/types";

export const questions: Question[] = [
  {
    id: "lane-state",
    prompt: "You get an early lane lead. What happens next?",
    answers: [
      {
        id: "freeze",
        label: "Freeze, starve, and suffocate.",
        flavor: "Control is a love language.",
        weights: { discipline: 3, mechanics: 1, greed: 1 },
      },
      {
        id: "dive",
        label: "Dive immediately. Respect is overdue.",
        flavor: "The HP bar looked at you wrong.",
        weights: { ego: 3, chaos: 2, mechanics: 1, tilt: 1 },
      },
      {
        id: "roam",
        label: "Roam. Other lanes deserve your presence.",
        flavor: "You are the plot.",
        weights: { teamwork: 2, chaos: 2, ego: 1, mechanics: 1 },
      },
      {
        id: "plates",
        label: "Take plates until greed becomes theology.",
        flavor: "Gold now. Consequences later.",
        weights: { greed: 3, delusion: 1, discipline: 1 },
      },
    ],
  },
  {
    id: "behind",
    prompt: "You are 0/2 at eight minutes. Be honest.",
    answers: [
      {
        id: "scale",
        label: "Farm. Scale. Deny the timeline.",
        flavor: "Late game will vindicate you.",
        weights: { discipline: 2, delusion: 3, tilt: 1 },
      },
      {
        id: "flip",
        label: "Force a fight. Momentum is imaginary.",
        flavor: "One shutdown fixes everything.",
        weights: { chaos: 3, ego: 2, tilt: 1 },
      },
      {
        id: "blame",
        label: "Quietly blame jungle and keep queuing.",
        flavor: "Internally loud. Externally calm.",
        weights: { tilt: 3, delusion: 2, teamwork: -1 },
      },
      {
        id: "reset",
        label: "Play weak side and bleed as little as possible.",
        flavor: "The adults have arrived.",
        weights: { discipline: 3, teamwork: 2, ego: -1 },
      },
    ],
  },
  {
    id: "win-condition",
    prompt: "Which win feels the best?",
    answers: [
      {
        id: "montage",
        label: "A montage-worthy 1v9.",
        flavor: "Victory must be witnessed.",
        weights: { ego: 3, mechanics: 2, teamwork: -1 },
      },
      {
        id: "macro",
        label: "Perfect setup. Clean macro. No panic.",
        flavor: "A surgical collapse of enemy hope.",
        weights: { discipline: 3, teamwork: 1, greed: 1 },
      },
      {
        id: "annoy",
        label: "Winning by being profoundly irritating.",
        flavor: "Tilt is a resource.",
        weights: { chaos: 2, teamwork: 1, tilt: 2 },
      },
      {
        id: "comeback",
        label: "A forty-minute comeback you absolutely should not have won.",
        flavor: "Delusion rewarded.",
        weights: { delusion: 3, greed: 1, mechanics: 1 },
      },
    ],
  },
  {
    id: "warding",
    prompt: "Your relationship with vision is:",
    answers: [
      {
        id: "religion",
        label: "Sacred. I ward before I breathe.",
        flavor: "Information is a weapon.",
        weights: { discipline: 2, teamwork: 3 },
      },
      {
        id: "someone-else",
        label: "Important. For somebody else.",
        flavor: "Your minimap is decorative.",
        weights: { ego: 2, mechanics: 2, teamwork: -1 },
      },
      {
        id: "bait",
        label: "I ward only if it helps me bait a fight.",
        flavor: "Tactical recklessness.",
        weights: { chaos: 2, ego: 1, tilt: 1 },
      },
      {
        id: "forgot",
        label: "I forget until the death recap reminds me.",
        flavor: "Hindsight legend.",
        weights: { delusion: 2, tilt: 2, discipline: -1 },
      },
    ],
  },
  {
    id: "mechanics",
    prompt: "How do you feel about difficult mechanics?",
    answers: [
      {
        id: "need",
        label: "Necessary. If the combo is hard, I want it.",
        flavor: "Hands first. Consequences second.",
        weights: { mechanics: 3, ego: 2 },
      },
      {
        id: "clean",
        label: "Only if they are reliable under pressure.",
        flavor: "Execution should still be sane.",
        weights: { mechanics: 2, discipline: 2 },
      },
      {
        id: "optional",
        label: "I prefer decision-making over finger gymnastics.",
        flavor: "The map is the real combo.",
        weights: { teamwork: 2, discipline: 2, mechanics: -1 },
      },
      {
        id: "cope",
        label: "If I fail the combo, I call it limit testing.",
        flavor: "A doctrine of self-preservation.",
        weights: { delusion: 2, chaos: 2, tilt: 1 },
      },
    ],
  },
  {
    id: "shotcalling",
    prompt: "Baron is up. Your team hesitates. You:",
    answers: [
      {
        id: "ping",
        label: "Ping the correct call until reality submits.",
        flavor: "Authority through certainty.",
        weights: { teamwork: 2, discipline: 2, ego: 1 },
      },
      {
        id: "start",
        label: "Start it. If they follow, they follow.",
        flavor: "Leadership or sabotage. Both are forward motion.",
        weights: { chaos: 2, ego: 2, greed: 1 },
      },
      {
        id: "pick",
        label: "Hide in fog and look for the dramatic pick.",
        flavor: "You trust fate more than process.",
        weights: { mechanics: 2, chaos: 2, ego: 1 },
      },
      {
        id: "farm",
        label: "Catch side wave and assume they will survive.",
        flavor: "A breathtaking level of faith.",
        weights: { greed: 2, delusion: 2, teamwork: -1 },
      },
    ],
  },
  {
    id: "teammates",
    prompt: "A teammate misses an obvious play. Your first reaction:",
    answers: [
      {
        id: "adapt",
        label: "Adjust instantly and salvage the fight.",
        flavor: "You have seen worse.",
        weights: { teamwork: 3, discipline: 1, tilt: -1 },
      },
      {
        id: "judge",
        label: "A deep, private disappointment.",
        flavor: "Your silence is not forgiveness.",
        weights: { ego: 2, tilt: 2, discipline: 1 },
      },
      {
        id: "join",
        label: "Double down and make it even messier.",
        flavor: "Disaster is more fun together.",
        weights: { chaos: 3, teamwork: 1, tilt: 1 },
      },
      {
        id: "cope-lore",
        label: "Decide the game is now a personal redemption arc.",
        flavor: "You are no longer playing the same match.",
        weights: { delusion: 3, mechanics: 1, ego: 1 },
      },
    ],
  },
  {
    id: "champ-select",
    prompt: "What do you optimize for in champ select?",
    answers: [
      {
        id: "comfort",
        label: "Comfort picks. I trust my craft.",
        flavor: "Repetition earns power.",
        weights: { discipline: 2, mechanics: 2 },
      },
      {
        id: "counter",
        label: "Counterpick. I want leverage.",
        flavor: "Winning starts before loading screen.",
        weights: { ego: 1, discipline: 2, greed: 1 },
      },
      {
        id: "style",
        label: "Style. If it looks cool, it stays.",
        flavor: "Aesthetic conviction.",
        weights: { ego: 2, delusion: 2, mechanics: 1 },
      },
      {
        id: "chaos-pick",
        label: "Whatever makes the lobby uncomfortable.",
        flavor: "Psychological warfare begins now.",
        weights: { chaos: 3, ego: 1, teamwork: -1 },
      },
    ],
  },
  {
    id: "resources",
    prompt: "There is one wave, one camp, and one teammate asking for help.",
    answers: [
      {
        id: "resource-max",
        label: "Take the wave and the camp. Efficiency is mercy.",
        flavor: "Gold is truth.",
        weights: { greed: 3, ego: 1, teamwork: -1 },
      },
      {
        id: "help",
        label: "Drop everything and rotate.",
        flavor: "You still believe in society.",
        weights: { teamwork: 3, discipline: 1, greed: -1 },
      },
      {
        id: "half-half",
        label: "Clear one thing, then move.",
        flavor: "A compromise with destiny.",
        weights: { discipline: 2, greed: 1, teamwork: 1 },
      },
      {
        id: "assume",
        label: "Assume they are fine and continue scaling.",
        flavor: "Your calendar extends beyond this skirmish.",
        weights: { delusion: 2, greed: 2, tilt: -1 },
      },
    ],
  },
  {
    id: "legacy",
    prompt: "Which statement feels most true?",
    answers: [
      {
        id: "outplay",
        label: "If I outplay hard enough, all sins are forgiven.",
        flavor: "The church of mechanics.",
        weights: { mechanics: 2, ego: 2, delusion: 1 },
      },
      {
        id: "system",
        label: "Games are won by structure, not vibes.",
        flavor: "You may actually be employable.",
        weights: { discipline: 3, teamwork: 1 },
      },
      {
        id: "violence",
        label: "If there is no fight, I will manufacture one.",
        flavor: "Peace is wasted uptime.",
        weights: { chaos: 3, tilt: 1, ego: 1 },
      },
      {
        id: "inevitable",
        label: "I was always going to carry. The timeline just drifted.",
        flavor: "A magnificent refusal to learn.",
        weights: { delusion: 3, greed: 1, ego: 1 },
      },
    ],
  },
];
