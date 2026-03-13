import Phaser from 'phaser';

import { ASSET_KEYS } from '../core/constants/assetKeys';
import { SCENE_KEYS } from '../core/constants/sceneKeys';
import { SceneNavigator } from '../core/navigation/SceneNavigator';
import { GameSessionStore, gameSessionStore } from '../core/state/GameSessionStore';
import type {
  CharacterClassDefinition,
  CharacterGender,
  PortraitOption,
} from '../data/types/CharacterCreation';
import type { GameSession } from '../data/types/GameSession';
import type { CharacterCreationSceneData, OverworldSceneData } from '../data/types/SceneData';
import { CharacterCreationService } from '../systems/characterCreation/CharacterCreationService';
import { ContentLoader } from '../systems/content/ContentLoader';
import { CharacterCreationContentLoader } from '../systems/content/CharacterCreationContentLoader';
import { getCharacterCreationLayout, type CharacterCreationLayout } from '../ui/characterCreation/CharacterCreationLayout';

const NAME_MAX_LENGTH = 14;
const NAME_ALLOWED_CHARACTER = /^[A-Za-z0-9 _-]$/;

enum CreationField {
  Name = 0,
  Gender = 1,
  Class = 2,
  Confirm = 3,
}

const GENDER_OPTIONS: readonly CharacterGender[] = ['male', 'female'];

const cloneValue = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

export class CharacterCreationScene extends Phaser.Scene {
  private sessionStore!: GameSessionStore;
  private sessionDraft!: GameSession;
  private layout!: CharacterCreationLayout;

  private classDefinitions: CharacterClassDefinition[] = [];
  private portraitOptions: PortraitOption[] = [];

  private selectedField = CreationField.Name;
  private selectedGender: CharacterGender = 'male';
  private classIndex = 0;
  private nameDraft = '';

  private nameLabelText!: Phaser.GameObjects.Text;
  private genderLabelText!: Phaser.GameObjects.Text;
  private classLabelText!: Phaser.GameObjects.Text;

  private nameValueText!: Phaser.GameObjects.Text;
  private genderValueText!: Phaser.GameObjects.Text;
  private classValueText!: Phaser.GameObjects.Text;
  private detailText!: Phaser.GameObjects.Text;

  private nameRowPanel!: Phaser.GameObjects.Rectangle;
  private genderRowPanel!: Phaser.GameObjects.Rectangle;
  private classRowPanel!: Phaser.GameObjects.Rectangle;

  private characterPreviewPanel!: Phaser.GameObjects.Rectangle;
  private characterPreviewFrame!: Phaser.GameObjects.Rectangle;
  private characterPreviewImage!: Phaser.GameObjects.Image;

  private confirmText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      SceneNavigator.start(this, SCENE_KEYS.TITLE);
      return;
    }

    if (event.key === 'ArrowUp') {
      this.moveFieldSelection(-1);
      return;
    }

    if (event.key === 'ArrowDown') {
      this.moveFieldSelection(1);
      return;
    }

    if (event.key === 'ArrowLeft') {
      this.cycleCurrentOption(-1);
      return;
    }

    if (event.key === 'ArrowRight') {
      this.cycleCurrentOption(1);
      return;
    }

    if (event.key === 'Backspace') {
      this.handleBackspace();
      return;
    }

    if (event.key === 'Enter') {
      this.handleEnter();
      return;
    }

    this.handleNameTyping(event.key);
  };

  constructor() {
    super(SCENE_KEYS.CHARACTER_CREATION);
  }

  create(data: CharacterCreationSceneData = {}): void {
    this.cameras.main.setBackgroundColor('#131a33');

    this.sessionStore = this.resolveSessionStore();
    this.sessionDraft = this.resolveSessionDraft(data);

    this.classDefinitions = CharacterCreationContentLoader.getClassDefinitions();
    this.portraitOptions = CharacterCreationContentLoader.getPortraitOptions();

    this.hydrateDraftFromExistingProfile();
    this.layout = getCharacterCreationLayout(this.scale.width, this.scale.height);

    this.buildUi();
    this.refreshUi();
    this.registerInput();
  }

  private resolveSessionStore(): GameSessionStore {
    const registryStore = this.registry.get('sessionStore');
    if (registryStore instanceof GameSessionStore) {
      return registryStore;
    }

    this.registry.set('sessionStore', gameSessionStore);
    return gameSessionStore;
  }

  private resolveSessionDraft(data: CharacterCreationSceneData): GameSession {
    if (data.sessionSeed) {
      return cloneValue(data.sessionSeed);
    }

    const existingSession = this.sessionStore.getSession();
    if (existingSession) {
      return existingSession;
    }

    return ContentLoader.getDefaultSessionTemplate();
  }

  private hydrateDraftFromExistingProfile(): void {
    const profile = this.sessionDraft.playerProfile;
    if (!profile) {
      return;
    }

    this.nameDraft = profile.name;
    this.selectedGender = profile.gender === 'female' ? 'female' : 'male';

    const classIndex = this.classDefinitions.findIndex((classDef) => classDef.id === profile.classId);
    if (classIndex >= 0) {
      this.classIndex = classIndex;
    }
  }

  private buildUi(): void {
    const l = this.layout;

    this.add.rectangle(l.centerX, this.scale.height / 2, this.scale.width, this.scale.height, 0x111a34, 1).setOrigin(0.5);

    this.add
      .rectangle(l.centerX, 306, 790, 472, 0x152643, 0.55)
      .setStrokeStyle(2, 0x47679b, 0.65);

    this.add
      .rectangle(l.centerX, 304, 732, 422, 0x121a31, 0.75)
      .setStrokeStyle(2, 0x5d79a8, 0.75);

    this.add
      .text(l.centerX, l.titleY, 'Character Creation', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '52px',
        color: '#f8f2d0',
        stroke: '#111111',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(l.centerX, l.subtitleY, 'Create your protagonist profile.', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '20px',
        color: '#d4e5ff',
      })
      .setOrigin(0.5);

    this.nameRowPanel = this.createRowPanel(l.nameY);
    this.genderRowPanel = this.createRowPanel(l.genderY);
    this.classRowPanel = this.createRowPanel(l.classY);

    this.nameLabelText = this.add
      .text(l.labelX, l.nameY, 'Name:', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '28px',
        color: '#b8c8e8',
      })
      .setOrigin(0, 0.5);

    this.nameValueText = this.add
      .text(l.valueX, l.nameY, '', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '30px',
        color: '#f8f2d0',
      })
      .setOrigin(0, 0.5);

    this.genderLabelText = this.add
      .text(l.labelX, l.genderY, 'Gender:', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '28px',
        color: '#b8c8e8',
      })
      .setOrigin(0, 0.5);

    this.genderValueText = this.add
      .text(l.valueX, l.genderY, '', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '30px',
        color: '#f8f2d0',
      })
      .setOrigin(0, 0.5);

    this.classLabelText = this.add
      .text(l.labelX, l.classY, 'Class:', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '28px',
        color: '#b8c8e8',
      })
      .setOrigin(0, 0.5);

    this.classValueText = this.add
      .text(l.valueX, l.classY, '', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '30px',
        color: '#f8f2d0',
      })
      .setOrigin(0, 0.5);

    this.detailText = this.add
      .text(l.detailX, l.detailY, '', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '18px',
        color: '#d4e5ff',
        align: 'center',
        wordWrap: { width: l.detailWidth },
      })
      .setOrigin(0.5, 0.5)
      .setLineSpacing(5);

    this.add
      .text(l.characterPreviewX, l.characterPreviewY - l.characterPreviewPanelHeight / 2 - 12, 'Character Preview', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '24px',
        color: '#c5d8ff',
      })
      .setOrigin(0.5, 1);

    this.characterPreviewPanel = this.add
      .rectangle(
        l.characterPreviewX,
        l.characterPreviewY,
        l.characterPreviewPanelWidth,
        l.characterPreviewPanelHeight,
        0x182a48,
        0.85,
      )
      .setStrokeStyle(2, 0x6f8ebd, 0.82);

    this.characterPreviewFrame = this.add
      .rectangle(l.characterPreviewX, l.characterPreviewY, l.characterPreviewPanelWidth - 18, l.characterPreviewPanelHeight - 18, 0x0f1630, 0.72)
      .setStrokeStyle(2, 0x7895c8, 0.86);

    this.characterPreviewImage = this.add
      .image(l.characterPreviewX, l.characterPreviewY + 4, ASSET_KEYS.PIXEL)
      .setDisplaySize(l.characterPreviewImageWidth, l.characterPreviewImageHeight)
      .setTint(0xdce8ff);

    this.confirmText = this.add
      .text(l.centerX, l.confirmButtonY, '[ Confirm Character ]', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '50px',
        color: '#f8f2d0',
        stroke: '#111111',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setScale(0.6);

    this.statusText = this.add
      .text(l.centerX, l.statusY, '', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '18px',
        color: '#ffe082',
        align: 'center',
      })
      .setOrigin(0.5);

    this.add
      .text(l.centerX, l.keyboardHintY, 'Arrow Keys = navigate/change  |  Enter = select  |  Esc = return', {
        fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
        fontSize: '17px',
        color: '#9fb1d8',
      })
      .setOrigin(0.5, 1);
  }

  private createRowPanel(y: number): Phaser.GameObjects.Rectangle {
    return this.add
      .rectangle(this.layout.centerX - 72, y, 430, 48, 0x1b2847, 0.42)
      .setOrigin(0.5)
      .setStrokeStyle(1, 0x4d628f, 0.6);
  }

  private registerInput(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      return;
    }

    keyboard.on('keydown', this.onKeyDown);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      keyboard.off('keydown', this.onKeyDown);
    });
  }

  private moveFieldSelection(direction: -1 | 1): void {
    this.selectedField = Phaser.Math.Wrap(this.selectedField + direction, 0, 4) as CreationField;
    this.refreshUi();
  }

  private cycleCurrentOption(direction: -1 | 1): void {
    if (this.selectedField === CreationField.Gender) {
      const currentIndex = GENDER_OPTIONS.indexOf(this.selectedGender);
      const nextIndex = Phaser.Math.Wrap(currentIndex + direction, 0, GENDER_OPTIONS.length);
      this.selectedGender = GENDER_OPTIONS[nextIndex] ?? 'male';
      this.refreshUi();
      return;
    }

    if (this.selectedField === CreationField.Class) {
      if (this.classDefinitions.length === 0) {
        return;
      }

      this.classIndex = Phaser.Math.Wrap(this.classIndex + direction, 0, this.classDefinitions.length);
      this.refreshUi();
    }
  }

  private handleBackspace(): void {
    if (this.selectedField !== CreationField.Name || this.nameDraft.length === 0) {
      return;
    }

    this.nameDraft = this.nameDraft.slice(0, -1);
    this.refreshUi();
  }

  private handleEnter(): void {
    if (this.selectedField === CreationField.Gender || this.selectedField === CreationField.Class) {
      this.cycleCurrentOption(1);
      return;
    }

    if (this.selectedField === CreationField.Name) {
      this.moveFieldSelection(1);
      return;
    }

    this.confirmCreation();
  }

  private handleNameTyping(key: string): void {
    if (this.selectedField !== CreationField.Name) {
      return;
    }

    if (!NAME_ALLOWED_CHARACTER.test(key) || this.nameDraft.length >= NAME_MAX_LENGTH) {
      return;
    }

    this.nameDraft += key;
    this.refreshUi();
  }

  private refreshUi(): void {
    const currentClass = this.getCurrentClass();
    const matchedPortrait = this.getMatchedPortrait(currentClass, this.selectedGender);

    this.nameValueText.setText(this.nameDraft.length > 0 ? `[ ${this.nameDraft} ]` : '[ _ ]');
    this.genderValueText.setText(`< ${this.toGenderLabel(this.selectedGender)} >`);
    this.classValueText.setText(currentClass ? `< ${currentClass.displayName} >` : '< Unavailable >');

    const detailLines = [
      currentClass?.description ?? 'No class definitions were loaded.',
      '',
      `Portrait: ${matchedPortrait?.label ?? 'Fallback'}`,
    ];
    this.detailText.setText(detailLines.join('\n'));

    this.applyFieldState(this.selectedField === CreationField.Name, this.nameRowPanel, this.nameLabelText, this.nameValueText);
    this.applyFieldState(this.selectedField === CreationField.Gender, this.genderRowPanel, this.genderLabelText, this.genderValueText);
    this.applyFieldState(this.selectedField === CreationField.Class, this.classRowPanel, this.classLabelText, this.classValueText);

    this.confirmText
      .setColor(this.selectedField === CreationField.Confirm ? '#ffe082' : '#f8f2d0')
      .setScale(this.selectedField === CreationField.Confirm ? 0.64 : 0.6);

    this.refreshCharacterPreview(currentClass, this.selectedGender);
  }

  private applyFieldState(
    selected: boolean,
    rowPanel: Phaser.GameObjects.Rectangle,
    label: Phaser.GameObjects.Text,
    value: Phaser.GameObjects.Text,
  ): void {
    rowPanel.setFillStyle(selected ? 0x273c63 : 0x1b2847, selected ? 0.7 : 0.42);
    rowPanel.setStrokeStyle(selected ? 2 : 1, selected ? 0x8ab0ef : 0x4d628f, selected ? 0.9 : 0.6);
    label.setColor(selected ? '#ffe082' : '#b8c8e8');
    value.setColor(selected ? '#fff0b8' : '#f8f2d0');
  }

  private confirmCreation(): void {
    const normalizedName = CharacterCreationService.normalizeName(this.nameDraft);
    if (normalizedName.length < 2) {
      this.statusText.setText('Name must be at least 2 characters.');
      return;
    }

    const selectedClass = this.getCurrentClass();
    if (!selectedClass) {
      this.statusText.setText('Class options are unavailable. Return to title and retry.');
      return;
    }

    const selectedPortrait = this.getMatchedPortrait(selectedClass, this.selectedGender);
    if (!selectedPortrait) {
      this.statusText.setText('Portrait options are unavailable. Return to title and retry.');
      return;
    }

    const playerProfile = CharacterCreationService.createPlayerProfile({
      name: normalizedName,
      gender: this.selectedGender,
      classDefinition: selectedClass,
      portrait: selectedPortrait,
    });

    const updatedSession = CharacterCreationService.applyProfileToSession(this.sessionDraft, playerProfile);
    this.sessionStore.setSession(updatedSession);

    const sceneData: OverworldSceneData = {
      restoredSession: updatedSession,
    };

    SceneNavigator.start(this, SCENE_KEYS.OVERWORLD, sceneData);
  }

  private getCurrentClass(): CharacterClassDefinition | null {
    return this.classDefinitions[this.classIndex] ?? this.classDefinitions[0] ?? null;
  }

  private getMatchedPortrait(
    currentClass: CharacterClassDefinition | null,
    gender: CharacterGender,
  ): PortraitOption | null {
    if (!currentClass) {
      return null;
    }

    return CharacterCreationService.getPortraitForClassAndGender(this.portraitOptions, currentClass.id, gender);
  }

  private toGenderLabel(gender: CharacterGender): string {
    return gender === 'female' ? 'Female' : 'Male';
  }

  private refreshCharacterPreview(currentClass: CharacterClassDefinition | null, gender: CharacterGender): void {
    const textureCandidate = currentClass?.modelTextureByGender[gender] ?? ASSET_KEYS.PIXEL;
    const textureKey = this.textures.exists(textureCandidate) ? textureCandidate : ASSET_KEYS.PIXEL;

    if (this.characterPreviewImage.texture.key !== textureKey) {
      this.characterPreviewImage.setTexture(textureKey);
    }

    const texture = this.textures.get(textureKey);
    const previewFrame = texture.has('0') ? 0 : '__BASE';
    this.characterPreviewImage.setFrame(previewFrame);

    this.characterPreviewImage.setDisplaySize(
      this.layout.characterPreviewImageWidth,
      this.layout.characterPreviewImageHeight,
    );

    if (textureKey === ASSET_KEYS.PIXEL) {
      this.characterPreviewImage.setTint(0xdce8ff);
    } else {
      this.characterPreviewImage.clearTint();
    }
  }
}
