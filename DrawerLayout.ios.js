import React from 'react-native';
import { Animated, PanResponder, PropTypes, StyleSheet, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import autobind from 'autobind-decorator';

const DEVICE_WIDTH = parseFloat(Dimensions.get('window').width);
const THRESHOLD = DEVICE_WIDTH / 2;
const VX_MAX = 0.1;

const IDLE = 'Idle';
const DRAGGING = 'Dragging';
const SETTLING = 'Settling';

export default class DrawerLayout extends React.Component {

  static defaultProps = {
    drawerWidth: 0,
    drawerPosition: 'left',
  }

  static propTypes = {
    drawerWidth: PropTypes.number.isRequired,
    drawerPosition: PropTypes.oneOf(['left', 'right']).isRequired,
    renderNavigationView: PropTypes.func.isRequired,

    onDrawerSlide: PropTypes.func,
    onDrawerStateChanged: PropTypes.func,

    onDrawerOpen: PropTypes.func,
    onDrawerClose: PropTypes.func,

    /* Not implemented */
    keyboardDismissMode: PropTypes.oneOf(['none', 'on-drag']),
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      openValue: new Animated.Value(0),
    }
  }

  componentWillMount() {
    let { openValue } = this.state;

    openValue.addListener(({value}) => {
      this._lastOpenValue = value;
      this.props.onDrawerSlide && this.props.onDrawerSlide({nativeEvent: {offset: value}});
    });

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._shouldSetPanResponder,
      onPanResponderGrant: this._panResponderGrant,
      onPanResponderMove: this._panResponderMove,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: this._panResponderRelease,
      onPanResponderTerminate: (evt, gestureState) => { }
    });
  }

  render() {
    let { openValue } = this.state;
    let { drawerPosition, drawerWidth } = this.props;
    let dynamicDrawerStyles = {};
    dynamicDrawerStyles[drawerPosition] = 0;
    dynamicDrawerStyles.width = drawerWidth;

    /* Drawer styles */
    let outputRange;

    if (drawerPosition === 'left') {
      outputRange = [-drawerWidth, 0];
    } else {
      outputRange = [drawerWidth, 0];
    }

    let drawerTranslateX = openValue.interpolate({
      inputRange: [0, 1],
      outputRange,
      extrapolate: 'clamp',
    });
    let animatedDrawerStyles = {transform: [{translateX: drawerTranslateX}]};

    /* Overlay styles */
    let opacityOutputRange;

    let overlayOpacity = openValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.7],
      extrapolate: 'clamp',
    });
    let animatedOverlayStyles = {opacity: overlayOpacity};

    return (
      <View style={{flex: 1, backgroundColor: 'transparent'}} {...this._panResponder.panHandlers}>
        <Animated.View style={styles.main}>
          {this.props.children}
        </Animated.View>

        <TouchableWithoutFeedback onPress={this._onOverlayClick}>
          <Animated.View
            style={[styles.overlay, animatedOverlayStyles]}
            pointerEvents="none" />
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.drawer, dynamicDrawerStyles, animatedDrawerStyles]}>
          {this.props.renderNavigationView()}
        </Animated.View>
      </View>
    )
  }

  @autobind
  _onOverlayClick() {
    this.closeDrawer();
  }

  _emitStateChanged(newState) {
    this.props.onDrawerStateChanged && this.props.onDrawerStateChanged(newState);
  }

  @autobind
  openDrawer(options={}) {
    this._emitStateChanged(SETTLING);
    Animated.spring(this.state.openValue, {toValue: 1, bounciness: 0, restSpeedThreshold: 0.1, ...options}).start(() => {
      this.props.onDrawerOpen && this.props.onDrawerOpen();
      this._emitStateChanged(IDLE);
    });
  }

  @autobind
  closeDrawer(options={}) {
    this._emitStateChanged(SETTLING);
    Animated.spring(this.state.openValue, {toValue: 0, bounciness: 0, restSpeedThreshold: 1, ...options}).start(() => {
      this.props.onDrawerClose && this.props.onDrawerClose();
      this._emitStateChanged(IDLE);
    });
  }

  @autobind
  _handleDrawerOpen() {
    this.props.onDrawerOpen && this.props.onDrawerOpen();
  }

  @autobind
  _handleDrawerClose() {
    this.props.onDrawerClose && this.props.onDrawerClose();
  }

  @autobind
  _shouldSetPanResponder(e, {moveX, dx, dy}) {
    let { drawerPosition } = this.props;

    if (drawerPosition === 'left') {
      let overlayArea = DEVICE_WIDTH - (DEVICE_WIDTH - this.props.drawerWidth);

      if (this._lastOpenValue === 1) {
        if ((dx < 0 && (Math.abs(dx) > (Math.abs(dy) * 3))) || (moveX > overlayArea)) {
          this._isClosing = true;
          this._closingAnchorValue = this._getOpenValueForX(moveX);
          return true;
        }
      } else {
        if (moveX <= 35 && dx > 0) {
          this._isClosing = false;
          return true;
        } else {
          return false;
        }
      }
    } else {
      let overlayArea = DEVICE_WIDTH - this.props.drawerWidth;

      if (this._lastOpenValue === 1) {
        if ((dx > 0 && (Math.abs(dx) > (Math.abs(dy) * 3))) || (moveX < overlayArea)) {
          this._isClosing = true;
          this._closingAnchorValue = this._getOpenValueForX(moveX);
          return true;
        }
      } else {
        if (moveX >= DEVICE_WIDTH - 35 && dx < 0) {
          this._isClosing = false;
          return true;
        } else {
          return false;
        }
      }
    }
  }

  @autobind
  _panResponderGrant() {
    this._emitStateChanged(DRAGGING);
  }

  @autobind
  _panResponderMove(e, {moveX}) {
    let openValue = this._getOpenValueForX(moveX);

    if (this._isClosing) {
      openValue = 1 - (this._closingAnchorValue - openValue);
    }

    if (openValue > 1) {
      openValue = 1;
    } else if (openValue < 0) {
      openValue = 0;
    }

    this.state.openValue.setValue(openValue);
  }

  @autobind
  _panResponderRelease(e, {moveX, vx}) {
    let { drawerPosition } = this.props;
    let { openValue } = this.state;
    let previouslyOpen = this._isClosing;
    let isWithinVelocityThreshold = vx < VX_MAX && vx > -VX_MAX;

    if (drawerPosition === 'left') {
      if ((vx > 0 && moveX > THRESHOLD) || (vx >= VX_MAX) || isWithinVelocityThreshold && previouslyOpen && moveX > THRESHOLD) {
        this.openDrawer({velocity: vx});
      } else if ((vx < 0 && moveX < THRESHOLD) || (vx < -VX_MAX) || isWithinVelocityThreshold && !previouslyOpen) {
        this.closeDrawer({velocity: vx});
      } else if (previouslyOpen) {
       this.openDrawer();
      } else {
       this.closeDrawer();
      }
    } else {
      if ((vx < 0 && moveX < THRESHOLD) || (vx <= -VX_MAX) || isWithinVelocityThreshold && previouslyOpen && moveX < THRESHOLD) {
        this.openDrawer({velocity: -1 * vx});
      } else if ((vx > 0 && moveX > THRESHOLD) || (vx > VX_MAX) || isWithinVelocityThreshold && !previouslyOpen) {
        this.closeDrawer({velocity: -1 * vx});
      } else if (previouslyOpen) {
       this.openDrawer();
      } else {
       this.closeDrawer();
      }
    }
  }

  _getOpenValueForX(x) {
    let { drawerPosition, drawerWidth } = this.props;

    if (drawerPosition === 'left') {
      return x / drawerWidth;
    } else if (drawerPosition === 'right') {
      return (DEVICE_WIDTH - x) / drawerWidth;
    }
  }
}

let styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  main: {
    flex: 1,
  },
  overlay: {
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
