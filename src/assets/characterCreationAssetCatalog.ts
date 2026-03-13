import oldMan3FacesetUrl from './Actor/Characters/OldMan3/Faceset.png';
import oldMan3IdleUrl from './Actor/Characters/OldMan3/SeparateAnim/Idle.png';
import princessFacesetUrl from './Actor/Characters/Princess/Faceset.png';
import princessIdleUrl from './Actor/Characters/Princess/SeparateAnim/Idle.png';
import cavegirlFacesetUrl from './Actor/Characters/Cavegirl/Faceset.png';
import cavegirlIdleUrl from './Actor/Characters/Cavegirl/SeparateAnim/Idle.png';
import cavegirl2FacesetUrl from './Actor/Characters/Cavegirl2/Faceset.png';
import cavegirl2IdleUrl from './Actor/Characters/Cavegirl2/SeparateAnim/Idle.png';
import redNinja3FacesetUrl from './Actor/Characters/RedNinja3/Faceset.png';
import redNinja3IdleUrl from './Actor/Characters/RedNinja3/SeparateAnim/Idle.png';
import samuraiRedFacesetUrl from './Actor/Characters/SamuraiRed/Faceset.png';
import samuraiRedIdleUrl from './Actor/Characters/SamuraiRed/SeparateAnim/Idle.png';
import sorcererBlackFacesetUrl from './Actor/Characters/SorcererBlack/Faceset.png';
import sorcererBlackIdleUrl from './Actor/Characters/SorcererBlack/SeparateAnim/Idle.png';
import womanFacesetUrl from './Actor/Characters/Woman/Faceset.png';
import womanIdleUrl from './Actor/Characters/Woman/SeparateAnim/Idle.png';

export interface CharacterCreationClassModelAssetDefinition {
  textureKey: string;
  textureUrl: string;
  frameWidth: number;
  frameHeight: number;
}

const CLASS_MODEL_ASSET_MAP: Record<string, CharacterCreationClassModelAssetDefinition> = {
  class_model_blade_male: {
    textureKey: 'class_model_blade_male',
    textureUrl: samuraiRedIdleUrl,
    frameWidth: 16,
    frameHeight: 16,
  },
  class_model_blade_female: {
    textureKey: 'class_model_blade_female',
    textureUrl: princessIdleUrl,
    frameWidth: 16,
    frameHeight: 16,
  },
  class_model_mage_male: {
    textureKey: 'class_model_mage_male',
    textureUrl: sorcererBlackIdleUrl,
    frameWidth: 16,
    frameHeight: 16,
  },
  class_model_mage_female: {
    textureKey: 'class_model_mage_female',
    textureUrl: womanIdleUrl,
    frameWidth: 16,
    frameHeight: 16,
  },
  class_model_guardian_male: {
    textureKey: 'class_model_guardian_male',
    textureUrl: oldMan3IdleUrl,
    frameWidth: 16,
    frameHeight: 16,
  },
  class_model_guardian_female: {
    textureKey: 'class_model_guardian_female',
    textureUrl: cavegirlIdleUrl,
    frameWidth: 16,
    frameHeight: 16,
  },
  class_model_rogue_male: {
    textureKey: 'class_model_rogue_male',
    textureUrl: redNinja3IdleUrl,
    frameWidth: 16,
    frameHeight: 16,
  },
  class_model_rogue_female: {
    textureKey: 'class_model_rogue_female',
    textureUrl: cavegirl2IdleUrl,
    frameWidth: 16,
    frameHeight: 16,
  },
};

const PORTRAIT_ASSET_MAP: Record<string, string> = {
  portrait_blade_male: samuraiRedFacesetUrl,
  portrait_blade_female: princessFacesetUrl,
  portrait_mage_male: sorcererBlackFacesetUrl,
  portrait_mage_female: womanFacesetUrl,
  portrait_guardian_male: oldMan3FacesetUrl,
  portrait_guardian_female: cavegirlFacesetUrl,
  portrait_rogue_male: redNinja3FacesetUrl,
  portrait_rogue_female: cavegirl2FacesetUrl,
};

export const resolveCharacterCreationClassModelAsset = (
  textureKey: string,
): CharacterCreationClassModelAssetDefinition | null => {
  return CLASS_MODEL_ASSET_MAP[textureKey] ?? null;
};

export const resolveCharacterCreationPortraitAssetPath = (textureKey: string): string | null => {
  return PORTRAIT_ASSET_MAP[textureKey] ?? null;
};
