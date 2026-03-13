export const RIOT_DATA_DRAGON_VERSION = "16.5.1";

const dataDragonBase = `https://ddragon.leagueoflegends.com/cdn/${RIOT_DATA_DRAGON_VERSION}`;

export function getChampionSquareUrl(riotId: string) {
  return `${dataDragonBase}/img/champion/${riotId}.png`;
}

export function getChampionSplashUrl(riotId: string, skinNum = 0) {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${riotId}_${skinNum}.jpg`;
}

export function getChampionLoadingUrl(riotId: string, skinNum = 0) {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${riotId}_${skinNum}.jpg`;
}
