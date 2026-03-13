export interface OverworldBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OverworldSpawnPoint {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface OverworldNpcDefinition {
  id: string;
  name: string;
  x: number;
  y: number;
  interactionRadius: number;
  dialogueLines: string[];
}

export interface OverworldEncounterZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface OverworldMapDefinition {
  mapId: string;
  bounds: OverworldBounds;
  spawnPoint: OverworldSpawnPoint;
  npc: OverworldNpcDefinition;
  encounterZone?: OverworldEncounterZone;
}
