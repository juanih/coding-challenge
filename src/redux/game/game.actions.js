
import { GameActionTypes } from './game.types';
import { REFRESH_MATCH_FREQUENCY } from './game.config'; 
import { SOUNDS, playSound } from './game.sounds';

export const robotShotBall = () => {
  playSound(SOUNDS.INCOMING);
  return {
    type: GameActionTypes.ROBOT_SHOT_BALL,
    shotTime: Date.now()
  }
};

export const shotBall = (dispatch, nextRespTime) => {
  playSound(SOUNDS.OUTGOING);
  dispatch ({
    type: GameActionTypes.SHOT_BALL
  })
  setTimeout(() => {
    dispatch(robotShotBall())
  }, nextRespTime);
};

export const setClock = dispatch => {
  dispatch ({
    type: GameActionTypes.MOVE_CLOCK,
    clock: Date.now()
  });
  setTimeout(() => {
    setClock(dispatch);
  }, REFRESH_MATCH_FREQUENCY);
};

export const startGame = () => {
  return {
    type: GameActionTypes.START_GAME
  }
};

export const restarGame = () => {
  return {
    type: GameActionTypes.RESTART_GAME
  }
};

export const endGame = (gameScore) => {
  let newRecordReached = false;
  
  playSound(SOUNDS.GAME_OVER);

  const bestScore = Number(localStorage.getItem('highestScore'));

  if (!bestScore || gameScore > bestScore) {
    localStorage.setItem('highestScore', gameScore);
    newRecordReached = true;
  }
  
  return {
    type: GameActionTypes.END_GAME,
    bestScore:  Number(localStorage.getItem('highestScore')),
    newRecord: newRecordReached
  }
}
