import type { AssetPathId } from '../data/types/Content';

import titleBackgroundUrl from './Tilesets/TilesetNature.png';
import titleLogoUrl from './Ui/Theme/preview.png';
import uiPanelUrl from './Ui/Theme/Theme Wood/nine_path_panel.png';
import ninjaBlueIdleSheetUrl from './Actor/Characters/NinjaBlue/SeparateAnim/Idle.png';
import ninjaBlueWalkSheetUrl from './Actor/Characters/NinjaBlue/SeparateAnim/Walk.png';
import ninjaBlueAttackSheetUrl from './Actor/Characters/NinjaBlue/SeparateAnim/Attack.png';
import villager5SheetUrl from './Actor/Characters/Villager5/SpriteSheet.png';
import blueBatSheetUrl from './Monsters/BlueBat/SpriteSheet.png';
import greenSlimeSheetUrl from './Monsters/Slime/Slime.png';
import fieldTilesetUrl from './Tilesets/TilesetField.png';
import natureTilesetUrl from './Tilesets/TilesetNature.png';
import houseTilesetUrl from './Tilesets/TilesetHouse.png';
import waterRipplesSheetUrl from './Backgrounds/Animated/Water Ripples/SpriteSheet16x16.png';
import flowerSheetUrl from './Backgrounds/Animated/Plant/SpriteSheet16x16.png';
import redFlagSheetUrl from './Backgrounds/Animated/Flag/FlagRed16x16.png';
import leafParticleSheetUrl from './FX/Particle/Leaf.png';
import lanternGreenSheetUrl from './Monsters/LanternGreen/SpriteSheet.png';
import mouseSheetUrl from './Monsters/Mouse/SpriteSheet.png';
import crateObjectUrl from './Items/Object/CrateEmpty.png';
import bagObjectUrl from './Items/Object/Bag.png';

const ONE_PIXEL_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO6V1xkAAAAASUVORK5CYII=';

const ASSET_PATHS: Record<AssetPathId, string> = {
  PIXEL: ONE_PIXEL_DATA_URL,
  TITLE_BG: titleBackgroundUrl,
  TITLE_LOGO: titleLogoUrl,
  UI_PANEL: uiPanelUrl,
  NINJA_BOY_IDLE: ninjaBlueIdleSheetUrl,
  NINJA_BOY_WALK: ninjaBlueWalkSheetUrl,
  NINJA_BOY_ATTACK: ninjaBlueAttackSheetUrl,
  NINJA_BLUE_BAT: blueBatSheetUrl,
  NINJA_GREEN_SLIME: greenSlimeSheetUrl,
  NINJA_NPC_VILLAGER5: villager5SheetUrl,
  NINJA_TILESET_FIELD: fieldTilesetUrl,
  NINJA_TILESET_NATURE: natureTilesetUrl,
  NINJA_TILESET_HOUSE: houseTilesetUrl,
  NINJA_WATER_RIPPLES: waterRipplesSheetUrl,
  NINJA_AMBIENT_FLOWER: flowerSheetUrl,
  NINJA_FLAG_RED: redFlagSheetUrl,
  NINJA_PARTICLE_LEAF: leafParticleSheetUrl,
  NINJA_LANTERN_GREEN: lanternGreenSheetUrl,
  NINJA_MOUSE: mouseSheetUrl,
  ITEM_CRATE: crateObjectUrl,
  ITEM_BAG: bagObjectUrl,
};

export const resolveAssetPath = (assetId: AssetPathId): string | null => {
  return ASSET_PATHS[assetId] ?? null;
};

