import type { Archetype } from "@/lib/types";

export const archetypes: Archetype[] = [
  {
    key: "ego-technician",
    title: "The Ego Technician",
    subtitle: "You do not want a clean play. You want the camera on you.",
    description:
      "You trust mechanics more than people, macro, or consequences. If the outplay is clean enough, you consider every earlier mistake retroactively justified.",
    roastPool: [
      "You call it discipline right up until the montage music starts.",
      "Your mechanics are real. Your humility is a myth told to children.",
      "Every clean outplay buys you three fresh crimes and you know it.",
      "You do not want a win condition. You want applause with particles.",
    ],
    dominantTraits: ["ego", "mechanics", "discipline"],
    traitWeights: { ego: 1.4, mechanics: 1.45, discipline: 1.15, greed: 0.5 },
    statProfile: {
      tiltResistance: 61,
      egoDensity: 91,
      greedIndex: 58,
      mapAwareness: 54,
      teamCooperation: 45,
    },
    championPool: ["yasuo", "yone", "lee-sin", "riven", "jhin", "ahri"],
  },
  {
    key: "map-ignoring-menace",
    title: "The Map-Ignoring Menace",
    subtitle: "The minimap is visible. You simply reject its authority.",
    description:
      "You can play brilliantly inside a tight little circle of personal drama. Outside that circle, pings, roams, and teleports become folklore.",
    roastPool: [
      "You have excellent mechanics and the object permanence of a goldfish with swagger.",
      "Some people track teleports. You track whether your opponent looked disrespectful.",
      "If tunnel vision were a resource, you would be full build at six minutes.",
      "The minimap is not bugged. You are just spiritually committed to ignoring it.",
    ],
    dominantTraits: ["mechanics", "ego", "tilt"],
    traitWeights: { mechanics: 1.3, ego: 1.2, tilt: 0.95, chaos: 0.8 },
    statProfile: {
      tiltResistance: 38,
      egoDensity: 84,
      greedIndex: 64,
      mapAwareness: 19,
      teamCooperation: 31,
    },
    championPool: ["katarina", "draven", "ezreal", "ahri", "shaco", "vayne"],
  },
  {
    key: "honor-bait-support",
    title: "The Honor Bait Support",
    subtitle: "Half guardian angel, half silent HR complaint.",
    description:
      "You keep the team functional, track cooldowns, and save people who absolutely did not deserve it. You act selfless, but you are absolutely counting honors.",
    roastPool: [
      "You type 'all good' while drafting a private indictment.",
      "You are the team's adult in the room, which is tragic because the room is solo queue.",
      "You keep people alive mostly so they can disappoint you again immediately.",
      "Every lantern, shield, and peel is an invoice marked 'payable in honors.'",
    ],
    dominantTraits: ["teamwork", "discipline", "tilt"],
    traitWeights: { teamwork: 1.45, discipline: 1.2, tilt: 0.65, ego: 0.3 },
    statProfile: {
      tiltResistance: 76,
      egoDensity: 42,
      greedIndex: 24,
      mapAwareness: 82,
      teamCooperation: 94,
    },
    championPool: ["thresh", "nami", "braum", "lulu", "rakan", "orianna"],
  },
  {
    key: "coinflip-emperor",
    title: "The Coinflip Emperor",
    subtitle: "You treat volatility like a birthright.",
    description:
      "You can hard-carry or hard-run with the exact same body language. Stable games bore you. You prefer matches where everyone has to react to your momentum or your collapse.",
    roastPool: [
      "You are not inconsistent. You are a volatility tutorial with hands.",
      "Your win rate is basically weather with better hair.",
      "Nobody can predict your next move, including the part of your brain that hates consequences.",
      "You do not throw games. You merely insist on late dramatic editing.",
    ],
    dominantTraits: ["chaos", "ego", "greed"],
    traitWeights: { chaos: 1.5, ego: 1.1, greed: 1.15, tilt: 0.9 },
    statProfile: {
      tiltResistance: 34,
      egoDensity: 79,
      greedIndex: 87,
      mapAwareness: 33,
      teamCooperation: 27,
    },
    championPool: ["draven", "pyke", "kayn", "hecarim", "lee-sin", "riven"],
  },
  {
    key: "scaling-delusionist",
    title: "The Scaling Delusionist",
    subtitle: "The game is always two waves away from finally respecting you.",
    description:
      "You believe the future belongs to you even when the present is on fire. Sometimes you hit your spike. Sometimes you spent half an hour farming a cautionary tale.",
    roastPool: [
      "You call it patience. Your team calls it missing in action.",
      "Every risky farm pattern becomes acceptable once you whisper 'I outscale.'",
      "You do not ignore danger. You simply believe the spreadsheet will save you.",
      "Your optimism is stronger than your lane phase and that is saying something.",
    ],
    dominantTraits: ["delusion", "greed", "discipline"],
    traitWeights: { delusion: 1.45, greed: 1.1, discipline: 1.15, mechanics: 0.4 },
    statProfile: {
      tiltResistance: 69,
      egoDensity: 58,
      greedIndex: 84,
      mapAwareness: 51,
      teamCooperation: 40,
    },
    championPool: ["nasus", "veigar", "viktor", "vayne", "jinx", "yone"],
  },
  {
    key: "perma-fight-goblin",
    title: "The Perma-Fight Goblin",
    subtitle: "If the map stays quiet, you assume it is your fault.",
    description:
      "You play like downtime is a bug report. Waves are optional. Objectives are just scenic backdrops for bad engages you still believe in.",
    roastPool: [
      "You see a quiet map and take it personally.",
      "Your favorite cooldown is whatever lets you start another terrible idea sooner.",
      "The line between engage and impulse vanished for you seasons ago.",
      "Some players scale. You accelerate the match into a contained emergency.",
    ],
    dominantTraits: ["chaos", "mechanics", "tilt"],
    traitWeights: { chaos: 1.35, mechanics: 1, tilt: 1.05, ego: 0.9 },
    statProfile: {
      tiltResistance: 29,
      egoDensity: 71,
      greedIndex: 63,
      mapAwareness: 28,
      teamCooperation: 48,
    },
    championPool: ["katarina", "pyke", "rakan", "jinx", "kayn", "yasuo"],
  },
];
