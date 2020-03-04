import { MotionActionTypes } from './motion.types';
import { updateLastMovements, analizeLastMovements, normalizeData } from './motion.utils';
import { MOVEMENTS_REFRESH_RATE } from './motion.config';

const INITIAL_STATE = {
  x: 0,
  y: 0,
  z: 0,
  alpha: 0,
  beta: 0,
  gama: 0,
  shot: undefined,
  deviceOS: 'iOS',
  lastSensorReadingTime: 0,
  lastMovements: [],
  isRecording: false,
  recordArray: []
}

const motionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MotionActionTypes.SET_DEVICE_OS: 
      return {
        ...state,
        deviceOS: action.deviceOS
      }
    case MotionActionTypes.MOTION_UPDATE_DATA_SENSORS:
      const { x, y, z, alpha, beta, gamma } = normalizeData(action.data, state.deviceOS); 
      const currentTime = Date.now();

      return currentTime - state.lastSensorReadingTime > MOVEMENTS_REFRESH_RATE
        ? {
            ...state,
            lastSensorReadingTime: currentTime,
          }
        : {
            ...state, x, y, z, alpha, beta, gamma,
            lastSensorReadingTime: currentTime,
            lastMovements: updateLastMovements(state),
            recordArray: state.isRecording 
              ? [{ x, y, z, alpha, beta, gamma, currentTime }]
              : state.recordArray,
            isRecording: false
          }
    case MotionActionTypes.MOTION_FIND_KNOW_SHOT:
      return {
        ...state,
        shot: !state.shot
          ? analizeLastMovements(state.lastMovements)
          : undefined
      }
    case MotionActionTypes.TOGGLE_RECORD: 
      const { recordArray } = state;
      localStorage.setItem('recordArray', JSON.stringify(recordArray));
      return {
        ...state,
        isRecording: !state.isRecording,
        recordArray: !state.isRecording ? state.recordArray : []
      }
    default: 
      return state;
  }
}

export default motionReducer;