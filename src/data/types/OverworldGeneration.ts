export interface GridPoint {
  x: number;
  y: number;
}

export interface GridRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OverworldAmbientAnchorSet {
  waterRipplePoints: GridPoint[];
  flowerPoints: GridPoint[];
  lanternPoints: GridPoint[];
  flagPoints: GridPoint[];
  leafArea: GridRect;
}

export interface GeneratedOverworldLayout {
  width: number;
  height: number;
  ground: number[][];
  terrain: number[][];
  props: number[][];
  ambientAnchors: OverworldAmbientAnchorSet;
}
