Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactNative = require('react-native');

var _reactNative2 = _interopRequireDefault(_reactNative);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var DEVICE_WIDTH = parseFloat(_reactNative.Dimensions.get('window').width);
var THRESHOLD = DEVICE_WIDTH / 2;
var VX_MAX = 0.1;

var IDLE = 'Idle';
var DRAGGING = 'Dragging';
var SETTLING = 'Settling';

var DrawerLayout = (function (_React$Component) {
  _inherits(DrawerLayout, _React$Component);

  _createClass(DrawerLayout, null, [{
    key: 'defaultProps',
    value: {
      drawerWidth: 0,
      drawerPosition: 'left'
    },
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      drawerWidth: _reactNative.PropTypes.number.isRequired,
      drawerPosition: _reactNative.PropTypes.oneOf(['left', 'right']).isRequired,
      renderNavigationView: _reactNative.PropTypes.func.isRequired,

      onDrawerSlide: _reactNative.PropTypes.func,
      onDrawerStateChanged: _reactNative.PropTypes.func,

      onDrawerOpen: _reactNative.PropTypes.func,
      onDrawerClose: _reactNative.PropTypes.func,

      /* Not implemented */
      keyboardDismissMode: _reactNative.PropTypes.oneOf(['none', 'on-drag'])
    },
    enumerable: true
  }]);

  function DrawerLayout(props, context) {
    _classCallCheck(this, DrawerLayout);

    _get(Object.getPrototypeOf(DrawerLayout.prototype), 'constructor', this).call(this, props, context);

    this.state = {
      openValue: new _reactNative.Animated.Value(0)
    };
  }

  _createDecoratedClass(DrawerLayout, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this = this;

      var openValue = this.state.openValue;

      openValue.addListener(function (_ref) {
        var value = _ref.value;

        _this._lastOpenValue = value;
        _this.props.onDrawerSlide && _this.props.onDrawerSlide({ nativeEvent: { offset: value } });
      });

      this._panResponder = _reactNative.PanResponder.create({
        onMoveShouldSetPanResponder: this._shouldSetPanResponder,
        onPanResponderGrant: this._panResponderGrant,
        onPanResponderMove: this._panResponderMove,
        onPanResponderTerminationRequest: function (evt, gestureState) {
          return true;
        },
        onPanResponderRelease: this._panResponderRelease,
        onPanResponderTerminate: function (evt, gestureState) {}
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var openValue = this.state.openValue;
      var _props = this.props;
      var drawerPosition = _props.drawerPosition;
      var drawerWidth = _props.drawerWidth;

      var dynamicDrawerStyles = {};
      dynamicDrawerStyles[drawerPosition] = 0;
      dynamicDrawerStyles.width = drawerWidth;

      /* Drawer styles */
      var outputRange = undefined;

      if (drawerPosition === 'left') {
        outputRange = [-drawerWidth, 0];
      } else {
        outputRange = [drawerWidth, 0];
      }

      var drawerTranslateX = openValue.interpolate({
        inputRange: [0, 1],
        outputRange: outputRange,
        extrapolate: 'clamp'
      });
      var animatedDrawerStyles = { transform: [{ translateX: drawerTranslateX }] };

      /* Overlay styles */
      var opacityOutputRange = undefined;

      var overlayOpacity = openValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.7],
        extrapolate: 'clamp'
      });
      var animatedOverlayStyles = { opacity: overlayOpacity };

      return _reactNative2.default.createElement(
        _reactNative.View,
        _extends({ style: { flex: 1, backgroundColor: 'transparent' } }, this._panResponder.panHandlers),
        _reactNative2.default.createElement(
          _reactNative.Animated.View,
          { style: styles.main },
          this.props.children
        ),
        _reactNative2.default.createElement(
          _reactNative.TouchableWithoutFeedback,
          { onPress: this._onOverlayClick },
          _reactNative2.default.createElement(_reactNative.Animated.View, {
            style: [styles.overlay, animatedOverlayStyles],
            pointerEvents: 'none' })
        ),
        _reactNative2.default.createElement(
          _reactNative.Animated.View,
          { style: [styles.drawer, dynamicDrawerStyles, animatedDrawerStyles] },
          this.props.renderNavigationView()
        )
      );
    }
  }, {
    key: '_onOverlayClick',
    decorators: [_autobindDecorator2.default],
    value: function _onOverlayClick() {
      this.closeDrawer();
    }
  }, {
    key: '_emitStateChanged',
    value: function _emitStateChanged(newState) {
      this.props.onDrawerStateChanged && this.props.onDrawerStateChanged(newState);
    }
  }, {
    key: 'openDrawer',
    decorators: [_autobindDecorator2.default],
    value: function openDrawer() {
      var _this2 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._emitStateChanged(SETTLING);
      _reactNative.Animated.spring(this.state.openValue, _extends({ toValue: 1, bounciness: 0, restSpeedThreshold: 0.1 }, options)).start(function () {
        _this2.props.onDrawerOpen && _this2.props.onDrawerOpen();
        _this2._emitStateChanged(IDLE);
      });
    }
  }, {
    key: 'closeDrawer',
    decorators: [_autobindDecorator2.default],
    value: function closeDrawer() {
      var _this3 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._emitStateChanged(SETTLING);
      _reactNative.Animated.spring(this.state.openValue, _extends({ toValue: 0, bounciness: 0, restSpeedThreshold: 1 }, options)).start(function () {
        _this3.props.onDrawerClose && _this3.props.onDrawerClose();
        _this3._emitStateChanged(IDLE);
      });
    }
  }, {
    key: '_handleDrawerOpen',
    decorators: [_autobindDecorator2.default],
    value: function _handleDrawerOpen() {
      this.props.onDrawerOpen && this.props.onDrawerOpen();
    }
  }, {
    key: '_handleDrawerClose',
    decorators: [_autobindDecorator2.default],
    value: function _handleDrawerClose() {
      this.props.onDrawerClose && this.props.onDrawerClose();
    }
  }, {
    key: '_shouldSetPanResponder',
    decorators: [_autobindDecorator2.default],
    value: function _shouldSetPanResponder(e, _ref2) {
      var moveX = _ref2.moveX;
      var dx = _ref2.dx;
      var dy = _ref2.dy;
      var drawerPosition = this.props.drawerPosition;

      if (drawerPosition === 'left') {
        var overlayArea = DEVICE_WIDTH - (DEVICE_WIDTH - this.props.drawerWidth);

        if (this._lastOpenValue === 1) {
          if (dx < 0 && Math.abs(dx) > Math.abs(dy) * 3 || moveX > overlayArea) {
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
        var overlayArea = DEVICE_WIDTH - this.props.drawerWidth;

        if (this._lastOpenValue === 1) {
          if (dx > 0 && Math.abs(dx) > Math.abs(dy) * 3 || moveX < overlayArea) {
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
  }, {
    key: '_panResponderGrant',
    decorators: [_autobindDecorator2.default],
    value: function _panResponderGrant() {
      this._emitStateChanged(DRAGGING);
    }
  }, {
    key: '_panResponderMove',
    decorators: [_autobindDecorator2.default],
    value: function _panResponderMove(e, _ref3) {
      var moveX = _ref3.moveX;

      var openValue = this._getOpenValueForX(moveX);

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
  }, {
    key: '_panResponderRelease',
    decorators: [_autobindDecorator2.default],
    value: function _panResponderRelease(e, _ref4) {
      var moveX = _ref4.moveX;
      var vx = _ref4.vx;
      var drawerPosition = this.props.drawerPosition;
      var openValue = this.state.openValue;

      var previouslyOpen = this._isClosing;
      var isWithinVelocityThreshold = vx < VX_MAX && vx > -VX_MAX;

      if (drawerPosition === 'left') {
        if (vx > 0 && moveX > THRESHOLD || vx >= VX_MAX || isWithinVelocityThreshold && previouslyOpen && moveX > THRESHOLD) {
          this.openDrawer({ velocity: vx });
        } else if (vx < 0 && moveX < THRESHOLD || vx < -VX_MAX || isWithinVelocityThreshold && !previouslyOpen) {
          this.closeDrawer({ velocity: vx });
        } else if (previouslyOpen) {
          this.openDrawer();
        } else {
          this.closeDrawer();
        }
      } else {
        if (vx < 0 && moveX < THRESHOLD || vx <= -VX_MAX || isWithinVelocityThreshold && previouslyOpen && moveX < THRESHOLD) {
          this.openDrawer({ velocity: -1 * vx });
        } else if (vx > 0 && moveX > THRESHOLD || vx > VX_MAX || isWithinVelocityThreshold && !previouslyOpen) {
          this.closeDrawer({ velocity: -1 * vx });
        } else if (previouslyOpen) {
          this.openDrawer();
        } else {
          this.closeDrawer();
        }
      }
    }
  }, {
    key: '_getOpenValueForX',
    value: function _getOpenValueForX(x) {
      var _props2 = this.props;
      var drawerPosition = _props2.drawerPosition;
      var drawerWidth = _props2.drawerWidth;

      if (drawerPosition === 'left') {
        return x / drawerWidth;
      } else if (drawerPosition === 'right') {
        return (DEVICE_WIDTH - x) / drawerWidth;
      }
    }
  }]);

  return DrawerLayout;
})(_reactNative2.default.Component);

exports.default = DrawerLayout;

var styles = _reactNative.StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0
  },
  main: {
    flex: 1
  },
  overlay: {
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});
module.exports = exports.default;