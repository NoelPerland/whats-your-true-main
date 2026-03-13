\# Coding Rules

\## Project: 2D JRPG (TypeScript + Phaser)



This file defines the practical coding rules for the project.



Its purpose is to keep the codebase stable during fast AI-assisted development.

These rules are meant to prevent common problems like:

\- giant scene files

\- duplicated logic

\- messy imports

\- broken state flow

\- hardcoded content

\- fragile refactors



These rules should always be followed unless explicitly told otherwise.



---



\# 1. Stack Rules



Use only:



\- TypeScript

\- Phaser 3

\- Vite

\- npm



Do not switch engines.

Do not introduce React, Vue, Pixi-only architecture, ECS frameworks, or unrelated libraries unless explicitly requested.



---



\# 2. File Size Rules



Prefer small and focused files.



Guidelines:

\- aim for one clear responsibility per file

\- avoid files growing past roughly 200 to 300 lines unless there is a good reason

\- split large systems into helper modules before they become hard to read

\- never put multiple major systems into one file



Bad:

\- one `BattleScene.ts` file containing UI, AI, formulas, animations, rewards, and save logic



Good:

\- `BattleScene.ts`

\- `CombatSystem.ts`

\- `BattleCommandMenu.ts`

\- `damage.ts`

\- `battleTypes.ts`



---



\# 3. Scene Rules



Scenes should stay lean.



Scenes may:

\- create game objects

\- connect systems

\- manage transitions

\- own scene-local input flow

\- coordinate presentation



Scenes should not:

\- contain complex combat formulas

\- contain inventory logic

\- contain large quest progression logic

\- contain reusable business logic

\- become catch-all managers



If scene logic grows too much, move it into a system or helper.



---



\# 4. System Rules



Systems own rules and logic.



Examples:

\- `CombatSystem` owns battle resolution

\- `DialogueSystem` owns dialogue progression

\- `InventorySystem` owns item add/remove/use rules

\- `SaveSystem` owns serialization



Systems should:

\- expose clean methods

\- avoid direct Phaser rendering dependencies where practical

\- be easy to reason about

\- use typed inputs and outputs



Prefer systems that can be tested without rendering.



---



\# 5. UI Rules



UI should display information and collect player input.



UI must not:

\- calculate combat formulas

\- directly mutate unrelated systems

\- own game progression rules



UI should:

\- call typed callbacks

\- render based on state

\- stay reusable where practical



For example:

\- the UI may return "attack selected"

\- the `CombatSystem` decides what that attack does



---



\# 6. Data Rules



Game content should be data-driven whenever practical.



Use structured content files for:

\- classes

\- enemies

\- skills

\- items

\- equipment

\- quests

\- dialogue

\- encounters

\- animations



Do not hardcode large content datasets inside TypeScript files.



Small constants are fine.

Large gameplay content is not.



---



\# 7. Type Rules



Use TypeScript types and interfaces aggressively.



Prefer:

\- explicit interfaces

\- named types

\- typed method arguments

\- typed return values



Avoid:

\- `any`

\- unclear object shapes

\- hidden implicit data contracts



If a structure is shared between files, define it in `src/data/`.



---



\# 8. Import Rules



Keep imports clean and predictable.



Prefer:

\- relative imports that are easy to trace, or a consistent alias strategy if added later

\- one import section per file

\- importing from stable module boundaries



Avoid:

\- tangled circular imports

\- deep cross-folder shortcuts without a pattern

\- importing scene files into systems unless absolutely necessary



Systems should not depend on scene internals.



---



\# 9. State Rules



State ownership must be clear.



Persistent state belongs in save-backed session data:

\- player profile

\- party

\- inventory

\- equipment

\- quests

\- flags

\- current progression



Scene state belongs in scenes:

\- currently open menu

\- local visual state

\- transient prompts

\- camera state



Entity state belongs in entities or battle actor state:

\- HP

\- MP

\- stats

\- status effects

\- animation state

\- position



Do not store the same responsibility in multiple places without a clear source of truth.



---



\# 10. Save Rules



Only save serializable data.



Do save:

\- strings

\- numbers

\- arrays

\- objects

\- progression state

\- inventory state

\- quest state

\- map state



Do not save:

\- Phaser scenes

\- sprites

\- timers

\- tweens

\- sound instances

\- containers

\- input objects



Save data should remain framework-agnostic.



---



\# 11. Battle Rules



Combat code must remain modular.



Keep separate:

\- battle state

\- damage formulas

\- status effect logic

\- AI behavior

\- UI rendering

\- animation timing



Do not bury battle rules inside button handlers.



Prefer battle flow like:

1\. choose action

2\. validate action

3\. resolve action

4\. emit result

5\. play presentation

6\. advance turn



---



\# 12. Animation Rules



Animation should be state-based and reusable.



Prefer named states like:

\- idle

\- walk

\- run

\- attack

\- cast

\- hurt

\- ko

\- victory



Do not hardcode one-off animation behavior all over the codebase.



Create reusable registration helpers and animation keys.



---



\# 13. Content Loader Rules



Raw JSON should not be parsed manually everywhere.



Use loader helpers or typed content accessors.



Good:

\- one place loads enemy data

\- one place validates skill data

\- scenes request typed content



Bad:

\- multiple scenes each manually parsing the same content file differently



---



\# 14. Refactor Rules



Refactor for clarity, not for cleverness.



When refactoring:

\- preserve behavior first

\- reduce coupling

\- improve naming

\- simplify responsibilities

\- keep public APIs stable where practical



Avoid large speculative refactors unless necessary.



---



\# 15. Naming Rules



Use clear descriptive names.



Prefer:

\- `CombatSystem`

\- `BattleActorState`

\- `loadEnemyDefinitions`

\- `createTitleMenu`



Avoid vague names like:

\- `Manager2`

\- `HelperThing`

\- `Stuff`

\- `doData`



Names should reveal purpose.



---



\# 16. TODO Rules



TODO comments are allowed only when useful.



Good TODOs:

\- specific

\- short

\- actionable



Example:

\- `TODO: Replace placeholder title menu with sprite-based UI panel`



Bad TODOs:

\- vague

\- endless

\- used instead of implementation



Example:

\- `TODO: make game better`



---



\# 17. Placeholder Rules



Placeholders are fine early, but they must be safe.



Placeholder assets, data, and UI should:

\- not crash if final assets are missing

\- be clearly marked

\- be easy to replace later



Prefer graceful fallback behavior.



---



\# 18. Dependency Rules



Prefer dependency flow like:



content -> data -> systems -> scenes -> UI/presentation



Avoid reverse coupling.



Especially avoid:

\- systems importing scene internals

\- UI importing battle formulas

\- content files depending on executable logic



---



\# 19. Testing Rules



Core logic should be testable in isolation when practical.



Best candidates:

\- damage formulas

\- turn order

\- status effect handling

\- inventory operations

\- save/load serialization

\- dialogue branching



Write these in a way that does not require rendering.



---



\# 20. Anti-Patterns to Reject



Reject code that introduces:

\- giant all-in-one files

\- duplicated enemy/item/skill data

\- scene-owned business logic

\- unclear mutable shared state

\- hardcoded progression everywhere

\- circular imports

\- excessive `any`

\- brittle one-off hacks that block expansion



---



\# 21. Final Rule for Codex



When generating or editing code for this project:



\- keep files focused

\- keep scenes lean

\- keep logic modular

\- use TypeScript types

\- favor data-driven content

\- preserve architecture

\- optimize for long-term vibe-coding stability

\- do not overengineer

