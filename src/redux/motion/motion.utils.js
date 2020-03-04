import { MOVEMENTS_BUFFER_SIZE } from './motion.config';

export const PLATFORMS = {
  IOS: 'IOS',
  ANDROID: 'ANDROID'
}

export const SHOTS = {
  FOREHAND: 'FOREHAND',
  BACKHAND: 'BACKHAND'
}

export const updateLastMovements = ({ x, y, z, alpha, beta, gamma, lastMovements }) => {
  const movement = {
    x, y, z, alpha, beta, gamma,
    time: Date.now()
  }

  if (lastMovements.length === 0) {
    return [movement];
  }

  if (lastMovements.length < MOVEMENTS_BUFFER_SIZE) {
    return [...lastMovements, movement];
  }

  if (lastMovements.length >= MOVEMENTS_BUFFER_SIZE) {
    return [...lastMovements.slice(1, lastMovements.length), movement];
  }
}

export const analizeLastMovements = (lastMovements) => {
  let detectedMovement = undefined;

  if (lastMovements.length !== MOVEMENTS_BUFFER_SIZE) return detectedMovement;

  if (isForehandShot(lastMovements)) {
    detectedMovement = SHOTS.FOREHAND;
  } 
  else if (isBackhandShot(lastMovements)) {
    detectedMovement = SHOTS.BACKHAND
  }

  return detectedMovement;
}


export const normalizeData = ({ x, y, z, alpha, beta, gamma }, deviceOS) => ({
    x: deviceOS === PLATFORMS.ANDROID ?  (-1) * x : x,
    y: deviceOS === PLATFORMS.ANDROID ?  (-1) * y : y,
    z: deviceOS === PLATFORMS.ANDROID ?  (-1) * z : z,
    alpha: deviceOS === PLATFORMS.ANDROID ?  (-1) * alpha : alpha,
    beta: deviceOS === PLATFORMS.ANDROID ?  (-1) * beta : beta,
    gamma: deviceOS === PLATFORMS.ANDROID ?  (-1) * gamma : gamma
})

const isForehandShot = movements => {
  if (!movements || movements.length < MOVEMENTS_BUFFER_SIZE) return false;

  let vector = [false, false, false, false, false, false];

  const isForehandShotMovement = movements.reduce((acc, curr) => {
    const xRange = curr.x >= 7 && curr.x <= 12;
    const yRange = curr.y >= -4 && curr.y <= 4;
    const zRange = curr.z >= -3 && curr.z <= 3;
  
    const alphaRange = curr.alpha <= -100 || curr.alpha >= 100;
    const betaRange = curr.beta >= 100 || curr.beta <= -100;
    const gammaRange = curr.gamma >= 20;

    return [
      acc[0] || xRange,
      acc[1] || yRange,
      acc[2] || zRange,
      acc[3] || alphaRange,
      acc[4] || betaRange,
      acc[5] || gammaRange
    ]

  }, vector);

  let shotRate = 0;

  isForehandShotMovement.forEach(element => {
    if (element) shotRate = shotRate + 1;
  });

  return shotRate === 6;
}

const isBackhandShot = movements => {
  if (!movements || movements.length < MOVEMENTS_BUFFER_SIZE) return false;

  let vector = [false, false, false, false, false, false];

  const isForehandShotMovement = movements.reduce((acc, curr) => {
    const xRange = curr.x >= -12 && curr.x <= -7;
    const yRange = curr.y >= -4 && curr.y <= 4;
    const zRange = curr.z >= -3 && curr.z <= 3;
  
    const alphaRange = curr.alpha <= -100 || curr.alpha >= 100;
    const betaRange = curr.beta >= 100 || curr.beta <= -100;
    const gammaRange = curr.gamma >= 20;

    return [
      acc[0] || xRange,
      acc[1] || yRange,
      acc[2] || zRange,
      acc[3] || alphaRange,
      acc[4] || betaRange,
      acc[5] || gammaRange
    ]

  }, vector);

  let shotRate = 0;

  isForehandShotMovement.forEach(element => {
    if (element) shotRate = shotRate + 1;
  });
  
  return shotRate === 6;

}
