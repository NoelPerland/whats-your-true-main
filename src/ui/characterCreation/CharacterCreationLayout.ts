export interface CharacterCreationLayout {
  centerX: number;
  titleY: number;
  subtitleY: number;
  nameY: number;
  genderY: number;
  classY: number;
  detailX: number;
  detailY: number;
  detailWidth: number;
  characterPreviewX: number;
  characterPreviewY: number;
  characterPreviewPanelWidth: number;
  characterPreviewPanelHeight: number;
  characterPreviewImageWidth: number;
  characterPreviewImageHeight: number;
  confirmButtonY: number;
  statusY: number;
  keyboardHintY: number;
  labelX: number;
  valueX: number;
}

export const getCharacterCreationLayout = (width: number, height: number): CharacterCreationLayout => {
  const centerX = width / 2;

  return {
    centerX,
    titleY: 72,
    subtitleY: 110,
    nameY: 188,
    genderY: 248,
    classY: 308,
    detailX: centerX - 100,
    detailY: 372,
    detailWidth: 470,
    characterPreviewX: centerX + 230,
    characterPreviewY: 300,
    characterPreviewPanelWidth: 232,
    characterPreviewPanelHeight: 262,
    characterPreviewImageWidth: 160,
    characterPreviewImageHeight: 196,
    confirmButtonY: 476,
    statusY: 510,
    keyboardHintY: Math.min(height - 10, 532),
    labelX: centerX - 250,
    valueX: centerX - 98,
  };
};
