import { MotionActionTypes } from './motion.types';

export const updateMotionData = data => ({
  type: MotionActionTypes.MOTION_UPDATE_DATA_SENSORS,
  data
});

export const findKnowShots = () => ({
  type: MotionActionTypes.MOTION_FIND_KNOW_SHOT
})

export const setDeviceOS = deviceOS => ({
  type: MotionActionTypes.SET_DEVICE_OS,
  deviceOS
})

export const toggleRecord = () => {
  return {
    type: MotionActionTypes.TOGGLE_RECORD
  }
}
