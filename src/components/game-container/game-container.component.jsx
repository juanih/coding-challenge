import React from 'react';
import { connect } from 'react-redux';
import { updateMotionData, findKnowShots, setDeviceOS } from '../../redux/motion/motion.actions';
import { setClock } from '../../redux/game/game.actions';
import { startAudios } from '../../redux/game/game.sounds';
import { PLATFORMS } from '../../redux/motion/motion.utils';
import { SHOT_ANALIZER_REFRESH_RATE } from '../../redux/motion/motion.config';

import './game-container.styles.css';

class GameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areSensorsEnabled: false
    }
    this.updateMotionData = this.updateMotionData.bind(this);
    this.startClock = this.startClock.bind(this);
    this.analizeShots = this.analizeShots.bind(this);
    this.initializeSensorsIos = this.initializeSensorsIos.bind(this);
    this.initializeSensorsAndroid = this.initializeSensorsAndroid.bind(this);
  }

  componentDidMount() {
    const { isAppleDevice } = this.props;
    this.startClock();
    if (!isAppleDevice) {
      this.initializeSensorsAndroid();
    }
    this.analizeShots();
  }

  startClock() {
    this.props.setClock();
  }

  initializeSensorsAndroid() {
    if (window.DeviceOrientationEvent) { 
      window.addEventListener('devicemotion', this.updateMotionData);
      this.props.setDeviceOS(PLATFORMS.ANDROID);
      this.setState({
        areSensorsEnabled: true
      });
    }
  }

  initializeSensorsIos() {
    startAudios();
    if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
      window.DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', this.updateMotionData);
            this.props.setDeviceOS(PLATFORMS.IOS);
            this.setState({
              areSensorsEnabled: true
            });
          }
        })
        .catch((error) => console.log('Error initializing Ios sensors', error));
    } else {
      alert("Your phone has the Accelerometer or Gyroscope disabled. Please, enable them to get a correct game experience.");
    }
  }

  analizeShots(){
    this.props.findKnowShots();
    setTimeout(() => {
      this.analizeShots();
    }, SHOT_ANALIZER_REFRESH_RATE);
  }

  componentWillUnmount() {
    window.removeEventListener('devicemotion', this.updateMotionData)
  }

  updateMotionData(event) {
    const { x, y, z } = event.accelerationIncludingGravity;
    const { alpha, beta, gamma } = event.rotationRate;
    const data = { x, y, z, alpha, beta, gamma };
    this.props.updateMotionData(data);
  }

  render() {
    const { areSensorsEnabled } = this.state;
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { areSensorsEnabled })
    );

    return (
      <div className='game-container'>
        { childrenWithProps }
        { this.props.isAppleDevice && !areSensorsEnabled &&
          <>
            <p className='sensors-message'>In order to have a good game experience, please give permission to the motion sensors.</p>
            <button className='permissions-button' onClick={() => this.initializeSensorsIos()}>Give permission</button>
          </>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    motion: state.motion,
    status: state.game.status,
    activePlayer: state.game.activePlayer
  };
}

const mapDispatchToProps = dispatch => ({
  updateMotionData: (data) => dispatch(updateMotionData(data)),
  setClock: () => setClock(dispatch),
  findKnowShots: () => dispatch(findKnowShots()),
  setDeviceOS: (deviceOS) => dispatch(setDeviceOS(deviceOS))
});

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
