import React from 'react';
import { connect } from 'react-redux';
import { GAME_STATUS, PLAYERS } from '../../redux/game/game.utils';
import { shotBall, startGame, restarGame, endGame } from '../../redux/game/game.actions';
 
import './game-screen.styles.css';

class GameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.startGame = this.startGame.bind(this);
    this.monitorHits = this.monitorHits.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === GAME_STATUS.STOPPED) {
      this.props.endGame(nextProps.shotCounter);
    }
    this.monitorHits(nextProps);
  }

  startGame() {
    const { areSensorsEnabled } = this.props;
    if (areSensorsEnabled) {
      this.props.startGame();
    }
  }

  monitorHits({ status, motion, shotEnable, nextRobotResponseTime }) {
    const isStatusOK = (status === GAME_STATUS.WAITING_SERVE || status === GAME_STATUS.PLAYING);
    
    if (shotEnable && isStatusOK && motion.shot) {
      this.props.shotBall(nextRobotResponseTime);
    }
  }

  render() {
    const { count, restarGame, status, bestScoreEver, newRecord, areSensorsEnabled } = this.props;
    return (
      <div className='screen-container'>
        { status === GAME_STATUS.WELCOME &&
          <div className='welcome-message' onClick={this.startGame}>
            <p>Welcome to Ping pong challenge!</p> 
            { areSensorsEnabled && <p className='touch-to-start'>Touch to start!</p> }
          </div>
        }
        { status !== GAME_STATUS.WELCOME && 
          <>
            <div className='counter'>{count}</div>
            {
              count === 0 && <div className='screen-message'>You serve!</div>
            }
          </>
        }
        { 
          status === GAME_STATUS.FINISHED
            ? ( <>
                  <div className='screen-message'>GAME OVER!</div>
                  { 
                    newRecord
                      ? <div className='record-messsage'>{`You have reached a new record: ${bestScoreEver} shots!!`}</div>
                      : <div className='score'>Best Score Ever: {bestScoreEver}</div>
                  }
                  <button className='permissions-button' onClick={() => restarGame()}>Restart</button>
                </>
              )
            : null
        }
      </div>
    );
  }
} 

const mapStateToProps = (state) => {
  const { game } = state;
  
  return { 
    count: game.shotCounter,
    status: game.status,
    shotCounter: game.shotCounter,
    shotEnable: 
      game.activePlayer === PLAYERS.MYSELF && 
      (game.status === GAME_STATUS.PLAYING || game.status === GAME_STATUS.WAITING_SERVE),
    nextRobotResponseTime: game.nextRobotResponseTime,
    level: game.level,
    bestScoreEver: game.bestScoreEver,
    motion: state.motion,
    newRecord: game.newRecord,
  }
};

const mapDispatchToProps = dispatch => ({
  shotBall: (nextRespTime) => shotBall(dispatch, nextRespTime),
  restarGame: () => dispatch(restarGame()),
  startGame: () => dispatch(startGame()),
  endGame: (score) => dispatch(endGame(score))
});

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen);