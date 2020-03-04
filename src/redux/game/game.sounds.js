import ballOutgoing from '../../sounds/ball-outgoing.mp3';
import ballIncoming from '../../sounds/ball-incoming.mp3';
import gameOver from '../../sounds/game-over.mp3';

export const SOUNDS = {
  OUTGOING: new Audio(ballOutgoing),
  INCOMING: new Audio(ballIncoming),
  GAME_OVER: new Audio(gameOver),
}

export const playSound = sound => {
  sound.play();
}

export const startAudios = () => {
  // Workaround to deal with safari limitation
  const audio1 = SOUNDS.OUTGOING;
  audio1.play();
  audio1.pause();
  const audio2 = SOUNDS.INCOMING;
  audio2.play();
  audio2.pause();
  const audio3 = SOUNDS.GAME_OVER;
  audio3.play();
  audio3.pause();
}