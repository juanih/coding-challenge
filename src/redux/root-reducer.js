import { combineReducers } from 'redux';
// import counterReducer from './counter/couter.reducer';
import motionReducer from './motion/motion.reducer';
import gameReducer from './game/game.reducer';

const rootReducer = combineReducers({
  // counter: counterReducer,
  motion: motionReducer,
  game: gameReducer
});

export default rootReducer;
