import { GameActionTypes } from './game.types';
import { 
  GAME_STATUS, 
  PLAYERS,
  switchPlayer, 
  getCurrentStatus,
  getNextRobotState,
  getMaxPlayerTimeToShot
} from './game.utils';

import {
  INITIAL_MAX_ROBOT_RESPONSE_TIME,
  INITIAL_MIN_ROBOT_RESPONSE_TIME,
  INITIAL_MAX_PLAYER_RESPONSE_TIME
} from './game.config';

const INITIAL_STATE = {
  status: GAME_STATUS.WELCOME,
  activePlayer: PLAYERS.MYSELF,
  shotCounter: 0,
  lastOpponentShotTime: undefined,
  clock: 0,
  minTimeRobotResponse:INITIAL_MIN_ROBOT_RESPONSE_TIME,
  maxTimeRobotResponse: INITIAL_MAX_ROBOT_RESPONSE_TIME,
  nextRobotResponseTime: INITIAL_MAX_ROBOT_RESPONSE_TIME,
  maxPlayerResponseTime: INITIAL_MAX_PLAYER_RESPONSE_TIME,
  bestScoreEver: 0,
  newRecord: false
}

const gameReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GameActionTypes.MOVE_CLOCK: {
      return {
        ...state,
        clock: action.clock,
        status: getCurrentStatus(state)
      }
    }
    case GameActionTypes.COUNTER_INCREMENT:
      return {
        ...state,
        shotCounter: state.shotCounter + 1,
      }
    case GameActionTypes.ROBOT_SHOT_BALL:
      return {
        ...state,
        activePlayer: switchPlayer(state.activePlayer),
        lastOpponentShotTime: action.shotTime,
        ...getNextRobotState(state.minTimeRobotResponse, state.maxTimeRobotResponse, state.shotCounter)
      }
    case GameActionTypes.SHOT_BALL:
      return {
        ...state,
        status: GAME_STATUS.PLAYING,
        activePlayer: switchPlayer(state.activePlayer),
        shotCounter: state.shotCounter + 1,
        maxPlayerResponseTime: getMaxPlayerTimeToShot(
          state.maxPlayerResponseTime,
          state.shotCounter
        )
      }
    case GameActionTypes.START_GAME: {
      return {
        ...state,
        status: GAME_STATUS.WAITING_SERVE
      }
    }
    case GameActionTypes.END_GAME:
      return {
        ...state,
        status: GAME_STATUS.FINISHED,
        newRecord: action.newRecord,
        bestScoreEver: action.bestScore
      }
    case GameActionTypes.RESTART_GAME: 
      return {
        ...INITIAL_STATE
      }
    default: 
      return state;
  }
}

export default gameReducer;