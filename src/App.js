import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';

import GameScreen from './components/game-screen/game-screen.component'
import GameContainer from './components/game-container/game-container.component';

export const isAppleDevice = navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i);

const App = () => (
  <Provider store={store}>
    <GameContainer isAppleDevice={isAppleDevice}>
      <GameScreen />
    </GameContainer>
  </Provider>
)

export default App;
