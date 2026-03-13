\# System Architecture

\## Project: 2D JRPG (TypeScript + Phaser)



This document defines the intended architecture for the 2D JRPG project.



Its purpose is to help Codex and future development keep the codebase:

\- modular

\- understandable

\- easy to extend

\- easy to refactor

\- safe for vibe coding



This is not meant to force overengineering.

It exists to keep systems clean while still moving fast.



---



\# 1. Core Architecture Philosophy



The game should be structured around a few key ideas:



\## 1.1 Scenes coordinate, systems execute

Phaser scenes should manage flow, rendering, and lifecycle.

Game logic should live in dedicated systems.



Scenes should:

\- create visuals

\- handle scene transitions

\- connect systems to UI

\- coordinate the current gameplay state



Scenes should NOT contain:

\- deep combat calculations

\- item rules

\- stat formulas

\- progression logic

\- dialogue branching logic

\- large blocks of reusable gameplay logic



\## 1.2 Systems own game rules

Systems should define how the game works.



Examples:

\- CombatSystem decides turn order, damage, status effects, victory

\- DialogueSystem decides line progression and branching

\- InventorySystem manages item ownership and item use rules

\- SaveSystem serializes and restores game state



\## 1.3 Data defines content

Content should live outside logic whenever practical.



Examples:

\- enemies

\- classes

\- items

\- skills

\- quests

\- dialogue

\- encounters

\- animation definitions



This makes balancing and iteration much easier.



\## 1.4 Entities are stateful game objects

Entities represent things in the game world or battle world.



Examples:

\- Player

\- PartyMember

\- Enemy

\- NPC

\- InteractableObject



Entities should contain state and behavior relevant to themselves, but not entire systems.



\## 1.5 UI is separate from game rules

UI should display and collect input.

UI should not decide the rules of combat, progression, or inventory behavior.



For example:

\- the battle menu lets the player choose "Attack"

\- the CombatSystem determines what attack means



---



\# 2. High-Level Module Layout



Use a structure like:



```text

src/

&nbsp; core/

&nbsp; scenes/

&nbsp; systems/

&nbsp; entities/

&nbsp; components/

&nbsp; ui/

&nbsp; data/

&nbsp; content/

&nbsp; utils/

3\. Responsibilities by Folder

3.1 core/



Contains project-wide foundations.



Suggested files:



game.ts



config.ts



sceneKeys.ts



events.ts



saveManager.ts



audioManager.ts



inputManager.ts



Responsibilities:



Phaser game bootstrap



global config



shared constants



cross-scene event bus if needed



global save/load entry points



shared audio handling



input mapping abstraction



3.2 scenes/



Contains Phaser scenes.



Suggested scenes:



BootScene



PreloadScene



TitleScene



CharacterCreationScene



OverworldScene



BattleScene



MenuScene



UIScene



Responsibilities:



initialize visual state



wire systems together



own scene-specific objects



manage transitions



run scene-specific update loops



3.3 systems/



Contains the main gameplay systems.



Suggested systems:



CombatSystem



DialogueSystem



AnimationSystem



InventorySystem



EquipmentSystem



QuestSystem



EncounterSystem



ProgressionSystem



PartySystem



SaveSystem



Responsibilities:



enforce game rules



expose clean APIs



be reusable between scenes



be testable outside rendering where practical



3.4 entities/



Contains classes for world and battle actors.



Suggested entities:



Player



PartyMember



Enemy



NPC



BattleActor



Interactable



Responsibilities:



state



identity



per-entity utility methods



links to stats, animations, and profile data



3.5 components/



Contains smaller reusable behaviors.



Examples:



HealthComponent



ManaComponent



StatsComponent



AnimationStateComponent



InteractableComponent



These are optional, but useful if repeated patterns emerge.



3.6 ui/



Contains reusable UI pieces.



Suggested files:



DialogueBox



ChoiceMenu



BattleCommandMenu



TargetSelector



PartyStatusPanel



InventoryPanel



EquipmentPanel



SaveMenu



TitleMenu



Responsibilities:



render panels and widgets



handle navigation and focus



expose selection callbacks



stay separate from business logic



3.7 data/



Contains types, interfaces, schemas, enums, and validation helpers.



Suggested files:



types.ts



combatTypes.ts



itemTypes.ts



skillTypes.ts



saveTypes.ts



animationTypes.ts



Responsibilities:



define shared interfaces



keep data formats explicit



reduce ambiguity in AI-generated code



3.8 content/



Contains structured content files.



Suggested content files:



classes.json



skills.json



items.json



equipment.json



enemies.json



encounters.json



dialogue.json



quests.json



partyMembers.json



animations.json



3.9 utils/



Contains helpers.



Examples:



random utilities



clamp helpers



math helpers



formatting helpers



deep clone / merge helpers



Keep utils small and generic.



4\. Runtime Architecture



At runtime, the game should roughly work like this:



4.1 Boot Flow



BootScene starts



basic config is initialized



PreloadScene loads required assets



TitleScene opens



player chooses New Game or Load Game



new game goes to CharacterCreationScene



game continues to OverworldScene



4.2 Overworld Flow



In the overworld:



player moves around map



NPC interaction triggers dialogue/events



chests and interactables trigger rewards/flags



encounters can start battles



menus can be opened



scene transitions load new maps



4.3 Battle Flow



When combat begins:



BattleScene starts



encounter data is loaded



player party and enemy combatants are created



battle UI is shown



turns are processed until win or lose



rewards are granted



state returns to OverworldScene



4.4 Menu Flow



Menus may be:



separate overlay scene



separate UI scene



modal UI within scene



Preferred approach:

use reusable UI components and keep menu logic isolated from field/battle rules.



5\. State Ownership



One of the most important rules:



Every major piece of state should have a clear owner.



5.1 Persistent State



Persistent state includes:



player profile



party data



inventory



equipment



story flags



quest flags



current map



save slot data



Preferred owner:



a global game state store or save-backed session state object



5.2 Scene State



Scene-local state includes:



camera position



local interactables



currently open menu



temporary battle animation state



visible dialogue panel state



Preferred owner:



the current scene or scene-local controllers



5.3 Entity State



Entity-local state includes:



HP



MP



status effects



base stats



combat state



current animation state



position



Preferred owner:



the entity or its attached components



6\. Suggested Central Game State



Use a shared state object for persistent game progression.



Example shape:



type GameSession = {

&nbsp; playerProfile: PlayerProfile;

&nbsp; party: PartyMemberState\[];

&nbsp; inventory: InventoryState;

&nbsp; equipment: EquipmentState;

&nbsp; quests: QuestState\[];

&nbsp; flags: Record<string, boolean>;

&nbsp; mapState: MapState;

&nbsp; progression: ProgressionState;

};



This object should be serializable for saving.



It should not contain heavy Phaser-specific objects.



Do NOT store live Sprite references or Scene references inside save state.



7\. Combat Architecture



Combat is one of the most important systems and should have clear boundaries.



7.1 CombatScene Responsibilities



BattleScene should:



create battle background



create sprites



create UI



initialize combat participants



ask CombatSystem what happens next



play animations and effects



update presentation



BattleScene should NOT:



directly implement the rules for damage formulas



directly manage complex status effect rules



hardcode skill logic inside UI buttons



7.2 CombatSystem Responsibilities



CombatSystem should:



own battle state



determine turn order



validate available actions



process selected actions



calculate damage/healing



apply status effects



check victory/loss



generate battle events for the scene to present



7.3 Recommended Battle Flow



Use an event-driven action resolution style.



Example flow:



current actor turn begins



system asks for valid commands



player or AI chooses action



system resolves action



system emits result events



scene plays animation/effects



state updates are applied



next turn begins



7.4 Battle Events



Prefer battle events like:



turn\_started



action\_selected



action\_resolved



damage\_applied



healing\_applied



status\_applied



actor\_defeated



battle\_won



battle\_lost



This makes the battle scene easier to animate and debug.



7.5 Battle Data Shapes



Design clear battle models.



Example concepts:



BattleActorState



BattleAction



BattleResult



StatusEffectInstance



TurnEntry



Keep them framework-agnostic where possible.



8\. Animation Architecture



Animation should not be random per scene.

Use a consistent approach.



8.1 AnimationSystem Responsibilities



The animation layer should:



map entity states to animation names



register Phaser animation definitions



manage playback requests



support timing hooks



allow future VFX sync



8.2 Recommended Approach



Use named animation states, for example:



idle



walk



run



attack



cast



hurt



ko



victory



Each character or enemy can map those names to different animation clips.



8.3 Animation Definitions



Support a structure like:



type AnimationDefinition = {

&nbsp; key: string;

&nbsp; texture: string;

&nbsp; frames: number\[];

&nbsp; frameRate: number;

&nbsp; repeat: number;

};



Store animation content in data or registration helpers.



8.4 Combat Timing Hooks



For battle actions, support timed signals such as:



hit frame



cast flash frame



projectile spawn frame



recovery complete



This helps combat feel much better.



9\. Dialogue Architecture



Dialogue should be system-driven, not hardcoded into scene scripts.



9.1 DialogueSystem Responsibilities



load dialogue content



track current conversation state



advance lines



expose choices



set flags based on choices



signal when dialogue is complete



9.2 Dialogue UI Responsibilities



render current speaker



render current text



render portraits if available



render choices



handle next/confirm input



9.3 Dialogue Data



Keep dialogue structured, for example:



conversation id



nodes



speaker



text



portrait id



choices



next node



optional flag changes



10\. Character Creation Architecture



Character creation should be its own controlled flow.



10.1 CharacterCreationScene Responsibilities



render creation UI



collect user selections



preview portrait/class if applicable



validate final selection



produce initial PlayerProfile



10.2 Character Creation Output



The final output should be a clean profile object, for example:



type PlayerProfile = {

&nbsp; name: string;

&nbsp; classId: string;

&nbsp; portraitId: string;

&nbsp; appearanceId: string;

&nbsp; baseStats: BaseStats;

&nbsp; learnedSkillIds: string\[];

};



This profile then seeds party and progression data.



11\. Save / Load Architecture



Saving should be safe and predictable.



11.1 Save Rules



save only serializable data



avoid saving live framework objects



version save data when practical



centralize save/load logic



11.2 Save Contents



Save:



player profile



party state



inventory



equipment



map location



quest progress



story flags



progression markers



Do not save:



Sprite instances



scene objects



timers



tweens



audio instances



12\. Content Loading Strategy



Content should be loaded through clear loaders.



12.1 Content Loader Responsibilities



read JSON content



validate required fields



expose typed data



cache content if useful



12.2 Loader Rule



Scenes and systems should ask loaders for data instead of manually parsing raw JSON everywhere.



This keeps the code much cleaner.



13\. Event / Quest Architecture



Keep progression logic organized.



13.1 QuestSystem Responsibilities



track active quests



track completion states



check condition requirements



apply rewards



expose quest progress summaries



13.2 Event Flags



Use a clean flag model for story progression.



Examples:



met\_mage\_companion



opened\_ruins\_gate



defeated\_first\_boss



Flags should live in persistent session state.



14\. Encounter Architecture



Field encounters should be cleanly isolated.



14.1 EncounterSystem Responsibilities



determine encounter triggers



choose enemy group from encounter tables



start battle scene with encounter payload



handle return results after battle



14.2 Encounter Data



Example encounter data:



encounter id



map id



enemy group ids



weight



min/max counts



optional conditions



15\. Recommended Dependency Direction



Prefer dependencies flowing like this:



content -> data -> systems -> scenes -> ui/presentation



Or more practically:



content feeds systems



systems inform scenes



scenes drive visuals



UI reads state and returns player choices



Avoid the reverse:



UI should not own combat logic



entities should not import whole scenes



content files should not contain executable logic



16\. Testability Rules



Even though this is a vibe-coded game, some parts should still be easy to test.



Best candidates for isolated testing:



damage calculations



status effect processing



turn order



inventory operations



save/load serialization



dialogue branching logic



Write these systems in a way that does not require Phaser rendering to verify core correctness.



17\. Refactor Rules



When refactoring:



preserve behavior first



reduce coupling



keep file names clear



avoid abstracting too early



only introduce new layers if they simplify iteration



A smaller simple architecture is better than a large “enterprise” one.



18\. Anti-Patterns to Avoid



Avoid these common mistakes:



18.1 Massive scene files



Do not put all gameplay logic in OverworldScene or BattleScene.



18.2 Hardcoded content



Do not embed all enemy/item/skill data directly in TypeScript files.



18.3 UI-owned rules



Do not let menu code calculate damage or decide stat progression.



18.4 Save-state pollution



Do not mix Phaser objects into persistent save data.



18.5 Giant update loops



Do not dump all gameplay flow into a single update().



18.6 Unclear state ownership



Do not allow multiple systems to mutate the same state without clear responsibility.



19\. Minimum First Playable Architecture



For the earliest playable version, implement:



BootScene



PreloadScene



TitleScene



CharacterCreationScene



OverworldScene



BattleScene



Systems:



DialogueSystem



CombatSystem



AnimationSystem



InventorySystem



SaveSystem



Content:



starter class data



3 skills per early character



4 to 6 enemies



1 encounter table



opening dialogue



1 boss configuration



This is enough to make a real vertical slice foundation.



20\. Final Instruction to Codex



When generating code for this project:



keep Phaser scenes lean



move reusable logic into systems



use TypeScript types everywhere practical



define content in structured data



keep save state serializable



build for fast iteration



do not overengineer



favor a playable modular JRPG foundation

