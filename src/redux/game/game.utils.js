import { DIFFICULT_RATE_PERCENTAGE, HITS_PER_LEVEL } from './game.config';

export const GAME_STATUS = {
  WELCOME: 'WELCOME',
  WAITING_SERVE: 'WAITING_SERVE',
  PLAYING: 'PLAYING',
  STOPPED: 'STOPPED',
  FINISHED: 'FINISHED',
}

export const PLAYERS = {
  MYSELF: 'MYSELF',
  OPPONENT: 'OPPONENT'
}

export const switchPlayer = (activePlayer) => (
  Object.keys(PLAYERS).find(player => player !== activePlayer)
);

export const getCurrentStatus = ({ maxPlayerResponseTime, lastOpponentShotTime, activePlayer, status }) => {
  const currentTime = Date.now();
  if (activePlayer === PLAYERS.OPPONENT) return GAME_STATUS.PLAYING;
  if (status === GAME_STATUS.STOPPED) return GAME_STATUS.STOPPED;

  switch (status) {
    case GAME_STATUS.PLAYING:
      return currentTime - lastOpponentShotTime > maxPlayerResponseTime
      ? GAME_STATUS.STOPPED
      : GAME_STATUS.PLAYING
    default:
      return status
  }
}

export const getNextRobotState = (min, max, shotCounter) => {
  const factor = (1 / DIFFICULT_RATE_PERCENTAGE);

  if (shotCounter > 0 && shotCounter % HITS_PER_LEVEL === 0) {
    min = min - (factor * min);
    max = max - (factor * max)
  }
  
  return {
    minTimeRobotResponse: min,
    maxTimeRobotResponse: max,
    nextRobotResponseTime: (Math.random() * (min - max) + max)
  }
}

export const getMaxPlayerTimeToShot = (maxTime, shotCounter) => {
  const factor = (1 / DIFFICULT_RATE_PERCENTAGE);
  return shotCounter > 0 && shotCounter % HITS_PER_LEVEL === 0
    ? maxTime - (factor * maxTime)
    : maxTime
} 

export const isAppleDevice = (navigator) => {
  return navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i);
}