\# Game Design Document

\## Project: Untitled 2D JRPG



\## 1. Overview



This project is a \*\*cool original 2D JRPG-inspired game\*\* built through fast iterative "vibe coding" with AI-assisted development. The goal is to create a \*\*playable, polished, expressive 2D RPG\*\* with strong visual identity, fun turn-based combat, character creation, sprite animation, exploration, and story progression.



The project should prioritize:

\- Fast prototyping

\- Playable results early

\- Strong visual charm

\- Expandable architecture

\- Data-driven systems

\- Modular code

\- Easy iteration on gameplay and content



This game should feel like a mix of:

\- classic SNES / PS1 / DS-era JRPG energy

\- modern indie pixel-art polish

\- expressive character-driven storytelling

\- satisfying combat and progression

\- strong "I want to keep building this" momentum



---



\## 2. Core Vision



Build a \*\*2D top-down JRPG\*\* with:



\- Character creation

\- Overworld exploration

\- NPC interactions

\- Story events and cutscenes

\- Towns and dungeons

\- Turn-based battles

\- Animated sprites

\- Equipment and stats

\- Leveling and skills

\- Party members

\- Save/load

\- Stylish menus and UI



The game should start as a \*\*vertical slice\*\*, but the foundation should support expansion into a larger RPG.



---



\## 3. Design Pillars



\### 3.1 Expressive Characters

The player should be able to create a protagonist and feel attached to the party through:

\- portrait choices

\- class/archetype identity

\- dialogue presence

\- combat role

\- visual style

\- progression



\### 3.2 Satisfying Combat

Battles should be:

\- turn-based

\- readable

\- animated

\- strategic without being slow

\- rewarding through weaknesses, buffs, skills, and timing



\### 3.3 Strong JRPG Feel

The game should evoke:

\- towns, routes, dungeons, bosses

\- party banter

\- story scenes

\- treasure and secrets

\- progression through story and systems



\### 3.4 Build Fast, Improve Often

The project is being vibe-coded, so architecture should support:

\- swapping systems easily

\- adding content quickly

\- replacing placeholder art later

\- balancing without rewriting logic

\- prototyping first, polishing second



\### 3.5 Style Matters

Even in early builds, the game should feel:

\- vibrant

\- cool

\- responsive

\- emotionally readable

\- fun to look at



---



\## 4. Genre and Format



\### Genre

2D JRPG / turn-based RPG / pixel-art adventure



\### Camera

Top-down exploration view



\### Battle Presentation

Side-view or front-facing turn-based combat scene with animated sprites and effects



\### Platforms

Initial target:

\- PC

\- keyboard/controller support



Potential later:

\- Steam Deck

\- Switch-like controller-first UX



---



\## 5. Player Fantasy



The player fantasy is:



> "I created a hero, entered a beautiful fantasy world, built a party, explored cool places, fought stylish animated battles, and went on a memorable adventure."



The player should feel like they are:

\- a chosen adventurer, outsider, or mysterious figure

\- gradually becoming stronger

\- uncovering a bigger mystery

\- forming bonds with allies

\- mastering new powers and strategies



---



\## 6. Scope Strategy



\## Phase 1: Vertical Slice

Create a polished 30–60 minute demo featuring:

\- Title screen

\- Character creation

\- Intro story sequence

\- 1 town

\- 1 route / overworld area

\- 1 dungeon

\- 3 playable characters total

\- 4–6 enemy types

\- 1 boss fight

\- Dialogue system

\- Inventory + equipment

\- Turn-based battle system

\- Save/load

\- Quest/progression flow

\- Basic animation set

\- Stylish menus



\## Phase 2: Expansion

Support future additions:

\- More regions

\- More classes

\- More recruitable characters

\- More bosses

\- More animated abilities

\- Crafting / shops / side quests

\- Relationship or bond events

\- Optional endgame/postgame content



---



\## 7. Character Creation System



\## Goal

The player creates the protagonist at the beginning of the game.



\## Character Creation Features

Include:

\- Name input

\- Pronoun selection if desired

\- Portrait selection

\- Base appearance preset selection

\- Color palette variants if practical

\- Starting class/archetype selection

\- Optional origin/background selection



\## Starting Archetypes

Examples:

\- \*\*Blade\*\*: balanced melee attacker

\- \*\*Mage\*\*: elemental caster

\- \*\*Guardian\*\*: defensive tank/support

\- \*\*Rogue\*\*: agility-based striker/debuffer

\- \*\*Acolyte\*\*: healing/support magic



\## Creation Design Rules

\- Choices should be meaningful but not overcomplicated

\- Early classes should alter starting stats, skills, and battle role

\- Content should be expandable later

\- Visual setup should be compatible with sprite variants and portraits



\## Technical Notes

Character creation data should be stored in a player profile structure:

\- name

\- class

\- appearance preset

\- portrait id

\- palette id

\- pronouns / text tags if used

\- starting stats

\- learned skills

\- story flags



---



\## 8. Exploration Gameplay



\## World Structure

The player moves through:

\- towns

\- routes

\- dungeons

\- special story maps



\## Exploration Features

\- directional movement

\- collision

\- interact button

\- NPC dialogue

\- treasure chests

\- map transitions

\- quest markers or lightweight hints

\- environmental details

\- event triggers



\## Dungeon Features

\- branching paths

\- enemy encounters

\- treasure rewards

\- simple puzzles

\- story scenes

\- boss room



\## Future Traversal Options

Potential later unlocks:

\- dash

\- air step / jump gap

\- spirit sight

\- key item unlocks

\- elemental field powers



---



\## 9. Combat System



\## Core Style

Turn-based combat with JRPG presentation.



\## Core Battle Loop

Each battle should include:

\- battle intro transition

\- party and enemy placement

\- turn order

\- command selection

\- action resolution

\- animation playback

\- damage / healing / status feedback

\- victory screen

\- rewards

\- return to field



\## Player Commands

\- Attack

\- Skill

\- Magic

\- Item

\- Defend

\- Escape



\## Combat Features

\- speed or initiative-based turns

\- elemental weaknesses

\- physical / magical damage types

\- buffs / debuffs

\- status effects

\- mana / skill resource

\- single-target and multi-target abilities

\- boss telegraphing

\- death / revive logic

\- victory rewards



\## Example Status Effects

\- Poison

\- Burn

\- Freeze

\- Sleep

\- Silence

\- Defense Down

\- Attack Up

\- Regen

\- Stun



\## Combat Design Goals

\- Easy to understand

\- Feels punchy and animated

\- Avoid sluggish menus

\- Encourage skill use over spamming attack

\- Let party composition matter

\- Support flashy boss encounters



---



\## 10. Battle Roles



Each party member should have a combat identity.



\### Role Examples

\- \*\*Hero\*\*: balanced damage, light support

\- \*\*Mage\*\*: elemental damage, weakness exploitation

\- \*\*Guardian\*\*: high defense, taunt/protect/buffs

\- \*\*Rogue\*\*: speed, crits, debuffs

\- \*\*Healer\*\*: recovery and cleansing



\### Party Design Rules

\- Every character should have a clear niche

\- No role should feel useless

\- Early party should teach synergy

\- Skills should feel distinct and visually memorable



---



\## 11. Animation System



\## Goals

Animation should make the game feel alive even before final polish.



\## Exploration Animations

Need:

\- idle

\- walk

\- run/dash

\- interact

\- hurt

\- emote if practical



\## Battle Animations

Need:

\- idle

\- attack

\- cast

\- skill/special

\- hurt

\- KO

\- victory

\- defend



\## Enemy Animations

Need:

\- idle

\- attack

\- hurt

\- defeated

\- special move



\## FX Animation

Need:

\- slash effects

\- elemental spell bursts

\- heal effects

\- buffs/debuffs

\- crit impacts

\- boss charge-up effects

\- UI hit flashes



\## Animation Style

Should be:

\- readable

\- snappy

\- stylized

\- compatible with placeholder art

\- easy to replace with improved assets later



\## Technical Notes

Animation should be data-driven where possible:

\- animation state names

\- frame timing

\- loops

\- event markers

\- sound triggers

\- hit timing triggers



---



\## 12. Story Direction



\## Premise

An ancient disturbance awakens dormant powers and threatens the balance of the world. The protagonist, whose identity or origin is tied to that disturbance, is pulled into a larger conflict involving ruins, factions, forgotten magic, and a truth hidden in the world’s past.



\## Opening Beat

The protagonist begins in or arrives at a frontier town. A strange celestial, magical, or ruin-related event causes monsters to appear or a sealed relic to awaken. The protagonist becomes directly involved and sets out with companions.



\## Themes

\- hope vs ruin

\- memory and identity

\- old magic returning

\- friendship and chosen family

\- power with a cost

\- truth hidden beneath myth



\## Writing Goals

\- concise dialogue

\- expressive party voices

\- strong opening hook

\- good rhythm between story and gameplay

\- avoid long exposition dumps

\- keep things cool, emotional, and readable



---



\## 13. Worldbuilding



The world should feel layered and inviting.



\## Possible Elements

\- ruined civilization

\- elemental shrines

\- floating relics

\- spirit forests

\- magical corruption

\- rival factions

\- sacred weapons

\- forgotten gods or cosmic systems



\## Area Design Rule

Each major location should have:

\- visual identity

\- music identity

\- unique enemies

\- story relevance

\- gameplay hook



---



\## 14. Progression Systems



\## Character Progression

\- EXP and leveling

\- class-flavored stat growth

\- learned skills by level

\- equipment upgrades

\- optional specialization later



\## Equipment Categories

\- weapon

\- armor

\- accessory



\## Item Categories

\- healing

\- mana restoration

\- revive

\- status cure

\- combat buff

\- quest item

\- crafting material later



\## Progression Feel

The player should regularly gain:

\- stronger stats

\- new skills

\- new gear

\- new story access

\- party growth

\- clearer build identity



---



\## 15. UI / UX



The interface should feel:

\- fast

\- stylish

\- controller-friendly

\- legible

\- clean

\- thematic



\## Required Menus

\- title menu

\- new game / load game

\- character creation

\- pause menu

\- party/status screen

\- inventory

\- equipment

\- skills

\- save/load

\- battle HUD

\- dialogue box

\- quest summary



\## UX Rules

\- no sluggish input

\- clear highlighting

\- visible stat comparisons

\- readable turn feedback

\- minimal button friction

\- battle commands should take few steps



---



\## 16. Audio Direction



\## Music Categories

\- title theme

\- town theme

\- route theme

\- dungeon theme

\- battle theme

\- boss theme

\- emotional theme

\- victory jingle



\## SFX Categories

\- menu move / confirm / cancel

\- footsteps

\- weapon impacts

\- spell casts

\- chest open

\- item pickup

\- dialogue blips

\- hit / crit / heal

\- level-up



---



\## 17. Technical Architecture



The project should be modular and data-driven.



\## Suggested Folder Structure

\- `src/core/`

\- `src/scenes/`

\- `src/systems/`

\- `src/entities/`

\- `src/components/`

\- `src/ui/`

\- `src/data/`

\- `src/assets/`

\- `src/utils/`

\- `src/content/`



\## Core Systems

\- scene manager

\- input manager

\- save manager

\- audio manager

\- dialogue system

\- quest/event system

\- combat system

\- animation controller

\- inventory/equipment system

\- data loader



\## Data-Driven Content

Store in JSON/YAML or equivalent:

\- classes

\- skills

\- enemies

\- items

\- equipment

\- NPCs

\- dialogue

\- quests

\- encounters

\- animations

\- maps metadata



\## Technical Principles

\- separate content from code

\- avoid hardcoding quest flow where possible

\- keep systems replaceable

\- support placeholder assets

\- build reusable UI components

\- prefer clear architecture over cleverness



---



\## 18. Vertical Slice Content Example



\## Starter Town

A compact frontier town near ancient ruins.



Contains:

\- inn

\- shop

\- town square

\- NPCs with flavor dialogue

\- intro story trigger



\## Route

A short wilderness area connecting town to dungeon.



Contains:

\- first encounters

\- treasure

\- tutorial-style exploration

\- optional side path



\## Dungeon

An ancient ruin / cave / shrine.



Contains:

\- stronger enemies

\- puzzle or key gate

\- story scene

\- boss room



\## Early Party

1\. Protagonist

2\. Mage companion

3\. Guardian ally



\## Enemies

\- slime creature

\- fang beast

\- corrupted vine

\- spirit wisp

\- ruin sentinel

\- cult scout



\## First Boss

A corrupted ancient guardian that teaches:

\- weakness usage

\- guarding

\- healing timing

\- phase escalation



---



\## 19. Production Philosophy



Because this game is being vibe-coded:

\- get something playable fast

\- accept placeholders

\- refactor when patterns are clear

\- prefer momentum over perfection

\- keep code understandable for AI iteration

\- document data formats and conventions

\- make every system demoable early



The goal is not just to write code.

The goal is to create a \*\*fun game fast\*\*, then improve it continuously.



---



\## 20. Success Criteria



The vertical slice is successful if:

\- character creation works

\- movement and interaction feel good

\- dialogue and story flow make sense

\- turn-based battles are fun

\- animations make combat feel alive

\- one boss fight feels memorable

\- saving/loading works

\- the project is easy to keep building



---



\## 21. Build Priorities



1\. project setup

2\. scene management

3\. player controller

4\. map system

5\. dialogue system

6\. character creation

7\. combat prototype

8\. animation controller

9\. inventory/equipment

10\. town + route + dungeon content

11\. boss fight

12\. save/load

13\. UI polish

14\. content expansion hooks

