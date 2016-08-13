import React from 'react';
import autobind from 'autobind-decorator';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import ReactNative from 'react-native';

const {
  Animated,
  Dimensions,
  InteractionManager,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} = ReactNative;

const {
  PropTypes,
} = React;

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
  };

  static positions = {
    Left: 'left',
    Right: 'right',
  };

  static propTypes = {
    children: PropTypes.node,
    drawerBackgroundColor: PropTypes.string,
    drawerLockMode: PropTypes.oneOf(['unlocked', 'locked-closed', 'locked-open']),
    drawerPosition: PropTypes.oneOf(['left', 'right']).isRequired,
    drawerWidth: PropTypes.number.isRequired,
    keyboardDismissMode: PropTypes.oneOf(['none', 'on-drag']),
    onDrawerClose: PropTypes.func,
    onDrawerOpen: PropTypes.func,
    onDrawerSlide: PropTypes.func,
    onDrawerStateChanged: PropTypes.func,
    renderNavigationView: PropTypes.func.isRequired,
    statusBarBackgroundColor: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);

    this.interactionHandle = null;

    this.state = {
      openValue: new Animated.Value(0),
      drawerShown: false,
    };
  }

  componentWillMount() {
    const { openValue } = this.state;

    openValue.addListener(({ value }) => {
      const drawerShown = value > 0;
      if (drawerShown !== this.state.drawerShown) {
        this.setState({ drawerShown });
      }

      if (this.props.keyboardDismissMode === 'on-drag') {
        dismissKeyboard();
      }

      if (value === 0 || value === 1) {
        if (this.interactionHandle) {
          InteractionManager.clearInteractionHandle(this.interactionHandle);
          this.interactionHandle = undefined;
        }
      } else if (!this.interactionHandle) {
        this.interactionHandle = InteractionManager.createInteractionHandle();
      }

      this._lastOpenValue = value;
      if (this.props.onDrawerSlide) {
        this.props.onDrawerSlide({ nativeEvent: { offset: value } });
      }
    });

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._shouldSetPanResponder,
      onPanResponderGrant: this._panResponderGrant,
      onPanResponderMove: this._panResponderMove,
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: this._panResponderRelease,
      onPanResponderTerminate: () => { },
    });
  }

  render() {
    const {
      drawerShown,
      openValue,
    } = this.state;

    const {
      drawerBackgroundColor,
      drawerPosition,
      drawerWidth,
    } = this.props;

    const dynamicDrawerStyles = {
      backgroundColor: drawerBackgroundColor,
    };
    dynamicDrawerStyles[drawerPosition] = 0;
    dynamicDrawerStyles.width = drawerWidth;

    /* Drawer styles */
    let outputRange;

    if (drawerPosition === 'left') {
      outputRange = [-drawerWidth, 0];
    } else {
      outputRange = [drawerWidth, 0];
    }

    const drawerTranslateX = openValue.interpolate({
      inputRange: [0, 1],
      outputRange,
      extrapolate: 'clamp',
    });
    const animatedDrawerStyles = { transform: [{ translateX: drawerTranslateX }] };

    /* Overlay styles */
    const overlayOpacity = openValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.7],
      extrapolate: 'clamp',
    });
    const animatedOverlayStyles = { opacity: overlayOpacity };

    return (
      <View style={{ flex: 1, backgroundColor: 'transparent' }} {...this._panResponder.panHandlers}>
        <Animated.View style={styles.main}>
          {this.props.children}
        </Animated.View>

        {drawerShown &&
          <TouchableWithoutFeedback onPress={this._onOverlayClick}>
            <Animated.View
              style={[styles.overlay, animatedOverlayStyles]} />
          </TouchableWithoutFeedback>
        }
        <Animated.View style={[styles.drawer, dynamicDrawerStyles, animatedDrawerStyles]}>
          {this.props.renderNavigationView()}
        </Animated.View>
      </View>
    );
  }

  @autobind
  _onOverlayClick(e) {
    e.stopPropagation();
    if (!this._isLockedClosed() && !this._isLockedOpen()) {
      this.closeDrawer();
    }
  }

  _emitStateChanged(newState) {
    if (this.props.onDrawerStateChanged) {
      this.props.onDrawerStateChanged(newState);
    }
  }

  @autobind
  openDrawer(options = {}) {
    this._emitStateChanged(SETTLING);
    Animated.spring(this.state.openValue, { toValue: 1, bounciness: 0, restSpeedThreshold: 0.1, ...options }).start(() => {
      if (this.props.onDrawerOpen) {
        this.props.onDrawerOpen();
      }
      this._emitStateChanged(IDLE);
    });
  }

  @autobind
  closeDrawer(options = {}) {
    this._emitStateChanged(SETTLING);
    Animated.spring(this.state.openValue, { toValue: 0, bounciness: 0, restSpeedThreshold: 1, ...options }).start(() => {
      if (this.props.onDrawerClose) {
        this.props.onDrawerClose();
      }
      this._emitStateChanged(IDLE);
    });
  }

  @autobind
  _handleDrawerOpen() {
    if (this.props.onDrawerOpen) {
      this.props.onDrawerOpen();
    }
  }

  @autobind
  _handleDrawerClose() {
    if (this.props.onDrawerClose) {
      this.props.onDrawerClose();
    }
  }

  @autobind
  _shouldSetPanResponder(e, { moveX, dx, dy }) {
    const { drawerPosition } = this.props;

    if (this._isLockedClosed() || this._isLockedOpen()) {
      return false;
    }

    if (drawerPosition === 'left') {
      const overlayArea = DEVICE_WIDTH - (DEVICE_WIDTH - this.props.drawerWidth);

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
        }

        return false;
      }
    } else {
      const overlayArea = DEVICE_WIDTH - this.props.drawerWidth;

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
        }

        return false;
      }
    }
  }

  @autobind
  _panResponderGrant() {
    this._emitStateChanged(DRAGGING);
  }

  @autobind
  _panResponderMove(e, { moveX }) {
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
  _panResponderRelease(e, { moveX, vx }) {
    const { drawerPosition } = this.props;
    const previouslyOpen = this._isClosing;
    const isWithinVelocityThreshold = vx < VX_MAX && vx > -VX_MAX;

    if (drawerPosition === 'left') {
      if ((vx > 0 && moveX > THRESHOLD) || (vx >= VX_MAX) || isWithinVelocityThreshold && previouslyOpen && moveX > THRESHOLD) {
        this.openDrawer({ velocity: vx });
      } else if ((vx < 0 && moveX < THRESHOLD) || (vx < -VX_MAX) || isWithinVelocityThreshold && !previouslyOpen) {
        this.closeDrawer({ velocity: vx });
      } else if (previouslyOpen) {
        this.openDrawer();
      } else {
        this.closeDrawer();
      }
    }

    if (drawerPosition === 'right') {
      if ((vx < 0 && moveX < THRESHOLD) || (vx <= -VX_MAX) || isWithinVelocityThreshold && previouslyOpen && moveX < THRESHOLD) {
        this.openDrawer({ velocity: -1 * vx });
      } else if ((vx > 0 && moveX > THRESHOLD) || (vx > VX_MAX) || isWithinVelocityThreshold && !previouslyOpen) {
        this.closeDrawer({ velocity: -1 * vx });
      } else if (previouslyOpen) {
        this.openDrawer();
      } else {
        this.closeDrawer();
      }
    }
  }

  _isLockedClosed() {
    return this.props.drawerLockMode === 'locked-closed' && !this.state.drawerShown;
  }

  _isLockedOpen() {
    return this.props.drawerLockMode === 'locked-open' && this.state.drawerShown;
  }

  _getOpenValueForX(x) {
    const { drawerPosition, drawerWidth } = this.props;

    if (drawerPosition === 'left') {
      return x / drawerWidth;
    } else if (drawerPosition === 'right') {
      return (DEVICE_WIDTH - x) / drawerWidth;
    }
  }
}

const styles = StyleSheet.create({
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
