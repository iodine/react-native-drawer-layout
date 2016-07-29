Object.defineProperty(exports, "__esModule", { value: true });exports.default = undefined;var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _desc, _value, _class, _class2, _temp, _jsxFileName = 'src/DrawerLayout.ios.js';var _react = require('react');var _react2 = _interopRequireDefault(_react);
var _reactNative = require('react-native');var _reactNative2 = _interopRequireDefault(_reactNative);
var _autobindDecorator = require('autobind-decorator');var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);
var _reactNativeDismissKeyboard = require('react-native-dismiss-keyboard');var _reactNativeDismissKeyboard2 = _interopRequireDefault(_reactNativeDismissKeyboard);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {var desc = {};Object['ke' + 'ys'](descriptor).forEach(function (key) {desc[key] = descriptor[key];});desc.enumerable = !!desc.enumerable;desc.configurable = !!desc.configurable;if ('value' in desc || desc.initializer) {desc.writable = true;}desc = decorators.slice().reverse().reduce(function (desc, decorator) {return decorator(target, property, desc) || desc;}, desc);if (context && desc.initializer !== void 0) {desc.value = desc.initializer ? desc.initializer.call(context) : void 0;desc.initializer = undefined;}if (desc.initializer === void 0) {Object['define' + 'Property'](target, property, desc);desc = null;}return desc;}var 


Animated = _reactNative2.default.Animated;var 
Dimensions = _reactNative2.default.Dimensions;var 
InteractionManager = _reactNative2.default.InteractionManager;var 
PanResponder = _reactNative2.default.PanResponder;var 
StyleSheet = _reactNative2.default.StyleSheet;var 
TouchableWithoutFeedback = _reactNative2.default.TouchableWithoutFeedback;var 
View = _reactNative2.default.View;var 



PropTypes = _react2.default.PropTypes;


var DEVICE_WIDTH = parseFloat(Dimensions.get('window').width);
var THRESHOLD = DEVICE_WIDTH / 2;
var VX_MAX = 0.1;

var IDLE = 'Idle';
var DRAGGING = 'Dragging';
var SETTLING = 'Settling';var 

DrawerLayout = (_class = (_temp = _class2 = function (_React$Component) {_inherits(DrawerLayout, _React$Component);
























  function DrawerLayout(props, context) {_classCallCheck(this, DrawerLayout);var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DrawerLayout).call(this, 
    props, context));

    _this.interactionHandle = null;

    _this.state = { 
      openValue: new Animated.Value(0), 
      drawerShown: false };return _this;}_createClass(DrawerLayout, [{ key: 'componentWillMount', value: function componentWillMount() 



    {var _this2 = this;var 
      openValue = this.state.openValue;

      openValue.addListener(function (_ref) {var value = _ref.value;
        var drawerShown = value > 0;
        if (drawerShown !== _this2.state.drawerShown) {
          _this2.setState({ drawerShown: drawerShown });}


        if (_this2.props.keyboardDismissMode === 'on-drag') {
          (0, _reactNativeDismissKeyboard2.default)();}


        if (value === 0 || value === 1) {
          if (_this2.interactionHandle) {
            InteractionManager.clearInteractionHandle(_this2.interactionHandle);
            _this2.interactionHandle = undefined;}} else 

        if (!_this2.interactionHandle) {
          _this2.interactionHandle = InteractionManager.createInteractionHandle();}


        _this2._lastOpenValue = value;
        if (_this2.props.onDrawerSlide) {
          _this2.props.onDrawerSlide({ nativeEvent: { offset: value } });}});



      this._panResponder = PanResponder.create({ 
        onMoveShouldSetPanResponder: this._shouldSetPanResponder, 
        onPanResponderGrant: this._panResponderGrant, 
        onPanResponderMove: this._panResponderMove, 
        onPanResponderTerminationRequest: function onPanResponderTerminationRequest() {return true;}, 
        onPanResponderRelease: this._panResponderRelease, 
        onPanResponderTerminate: function onPanResponderTerminate() {} });} }, { key: 'render', value: function render() 



    {var _state = 
      this.state;var openValue = _state.openValue;var drawerShown = _state.drawerShown;var _props = 
      this.props;var drawerPosition = _props.drawerPosition;var drawerWidth = _props.drawerWidth;
      var dynamicDrawerStyles = {};
      dynamicDrawerStyles[drawerPosition] = 0;
      dynamicDrawerStyles.width = drawerWidth;

      /* Drawer styles */
      var outputRange = void 0;

      if (drawerPosition === 'left') {
        outputRange = [-drawerWidth, 0];} else 
      {
        outputRange = [drawerWidth, 0];}


      var drawerTranslateX = openValue.interpolate({ 
        inputRange: [0, 1], 
        outputRange: outputRange, 
        extrapolate: 'clamp' });

      var animatedDrawerStyles = { transform: [{ translateX: drawerTranslateX }] };

      /* Overlay styles */
      var overlayOpacity = openValue.interpolate({ 
        inputRange: [0, 1], 
        outputRange: [0, 0.7], 
        extrapolate: 'clamp' });

      var animatedOverlayStyles = { opacity: overlayOpacity };

      return (
        _react2.default.createElement(View, _extends({ style: { flex: 1, backgroundColor: 'transparent' } }, this._panResponder.panHandlers, { __source: { fileName: _jsxFileName, lineNumber: 134 } }), 
        _react2.default.createElement(Animated.View, { style: styles.main, __source: { fileName: _jsxFileName, lineNumber: 135 } }, 
        this.props.children), 


        drawerShown && 
        _react2.default.createElement(TouchableWithoutFeedback, { onPress: this._onOverlayClick, __source: { fileName: _jsxFileName, lineNumber: 140 } }, 
        _react2.default.createElement(Animated.View, { 
          style: [styles.overlay, animatedOverlayStyles], __source: { fileName: _jsxFileName, lineNumber: 141 } })), 


        _react2.default.createElement(Animated.View, { style: [styles.drawer, dynamicDrawerStyles, animatedDrawerStyles], __source: { fileName: _jsxFileName, lineNumber: 145 } }, 
        this.props.renderNavigationView())));} }, { key: '_onOverlayClick', value: function _onOverlayClick(






    e) {
      e.stopPropagation();
      if (!this._isLockedClosed() && !this._isLockedOpen()) {
        this.closeDrawer();}} }, { key: '_emitStateChanged', value: function _emitStateChanged(



    newState) {
      if (this.props.onDrawerStateChanged) {
        this.props.onDrawerStateChanged(newState);}} }, { key: 'openDrawer', value: function openDrawer() 




    {var _this3 = this;var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      this._emitStateChanged(SETTLING);
      Animated.spring(this.state.openValue, _extends({ toValue: 1, bounciness: 0, restSpeedThreshold: 0.1 }, options)).start(function () {
        if (_this3.props.onDrawerOpen) {
          _this3.props.onDrawerOpen();}

        _this3._emitStateChanged(IDLE);});} }, { key: 'closeDrawer', value: function closeDrawer() 




    {var _this4 = this;var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      this._emitStateChanged(SETTLING);
      Animated.spring(this.state.openValue, _extends({ toValue: 0, bounciness: 0, restSpeedThreshold: 1 }, options)).start(function () {
        if (_this4.props.onDrawerClose) {
          _this4.props.onDrawerClose();}

        _this4._emitStateChanged(IDLE);});} }, { key: '_handleDrawerOpen', value: function _handleDrawerOpen() 




    {
      if (this.props.onDrawerOpen) {
        this.props.onDrawerOpen();}} }, { key: '_handleDrawerClose', value: function _handleDrawerClose() 




    {
      if (this.props.onDrawerClose) {
        this.props.onDrawerClose();}} }, { key: '_shouldSetPanResponder', value: function _shouldSetPanResponder(




    e, _ref2) {var moveX = _ref2.moveX;var dx = _ref2.dx;var dy = _ref2.dy;var 
      drawerPosition = this.props.drawerPosition;

      if (this._isLockedClosed() || this._isLockedOpen()) {
        return false;}


      if (drawerPosition === 'left') {
        var overlayArea = DEVICE_WIDTH - (DEVICE_WIDTH - this.props.drawerWidth);

        if (this._lastOpenValue === 1) {
          if (dx < 0 && Math.abs(dx) > Math.abs(dy) * 3 || moveX > overlayArea) {
            this._isClosing = true;
            this._closingAnchorValue = this._getOpenValueForX(moveX);
            return true;}} else 

        {
          if (moveX <= 35 && dx > 0) {
            this._isClosing = false;
            return true;}


          return false;}} else 

      {
        var _overlayArea = DEVICE_WIDTH - this.props.drawerWidth;

        if (this._lastOpenValue === 1) {
          if (dx > 0 && Math.abs(dx) > Math.abs(dy) * 3 || moveX < _overlayArea) {
            this._isClosing = true;
            this._closingAnchorValue = this._getOpenValueForX(moveX);
            return true;}} else 

        {
          if (moveX >= DEVICE_WIDTH - 35 && dx < 0) {
            this._isClosing = false;
            return true;}


          return false;}}} }, { key: '_panResponderGrant', value: function _panResponderGrant() 





    {
      this._emitStateChanged(DRAGGING);} }, { key: '_panResponderMove', value: function _panResponderMove(



    e, _ref3) {var moveX = _ref3.moveX;
      var openValue = this._getOpenValueForX(moveX);

      if (this._isClosing) {
        openValue = 1 - (this._closingAnchorValue - openValue);}


      if (openValue > 1) {
        openValue = 1;} else 
      if (openValue < 0) {
        openValue = 0;}


      this.state.openValue.setValue(openValue);} }, { key: '_panResponderRelease', value: function _panResponderRelease(



    e, _ref4) {var moveX = _ref4.moveX;var vx = _ref4.vx;var 
      drawerPosition = this.props.drawerPosition;
      var previouslyOpen = this._isClosing;
      var isWithinVelocityThreshold = vx < VX_MAX && vx > -VX_MAX;

      if (drawerPosition === 'left') {
        if (vx > 0 && moveX > THRESHOLD || vx >= VX_MAX || isWithinVelocityThreshold && previouslyOpen && moveX > THRESHOLD) {
          this.openDrawer({ velocity: vx });} else 
        if (vx < 0 && moveX < THRESHOLD || vx < -VX_MAX || isWithinVelocityThreshold && !previouslyOpen) {
          this.closeDrawer({ velocity: vx });} else 
        if (previouslyOpen) {
          this.openDrawer();} else 
        {
          this.closeDrawer();}}



      if (drawerPosition === 'right') {
        if (vx < 0 && moveX < THRESHOLD || vx <= -VX_MAX || isWithinVelocityThreshold && previouslyOpen && moveX < THRESHOLD) {
          this.openDrawer({ velocity: -1 * vx });} else 
        if (vx > 0 && moveX > THRESHOLD || vx > VX_MAX || isWithinVelocityThreshold && !previouslyOpen) {
          this.closeDrawer({ velocity: -1 * vx });} else 
        if (previouslyOpen) {
          this.openDrawer();} else 
        {
          this.closeDrawer();}}} }, { key: '_isLockedClosed', value: function _isLockedClosed() 




    {
      return this.props.drawerLockMode === 'locked-closed' && !this.state.drawerShown;} }, { key: '_isLockedOpen', value: function _isLockedOpen() 


    {
      return this.props.drawerLockMode === 'locked-open' && this.state.drawerShown;} }, { key: '_getOpenValueForX', value: function _getOpenValueForX(


    x) {var _props2 = 
      this.props;var drawerPosition = _props2.drawerPosition;var drawerWidth = _props2.drawerWidth;

      if (drawerPosition === 'left') {
        return x / drawerWidth;} else 
      if (drawerPosition === 'right') {
        return (DEVICE_WIDTH - x) / drawerWidth;}} }]);return DrawerLayout;}(_react2.default.Component), _class2.defaultProps = { drawerWidth: 0, drawerPosition: 'left' }, _class2.positions = { Left: 'left', Right: 'right' }, _class2.propTypes = { children: PropTypes.node, drawerLockMode: PropTypes.oneOf(['unlocked', 'locked-closed', 'locked-open']), drawerPosition: PropTypes.oneOf(['left', 'right']).isRequired, drawerWidth: PropTypes.number.isRequired, keyboardDismissMode: PropTypes.oneOf(['none', 'on-drag']), onDrawerClose: PropTypes.func, onDrawerOpen: PropTypes.func, onDrawerSlide: PropTypes.func, onDrawerStateChanged: PropTypes.func, renderNavigationView: PropTypes.func.isRequired }, _temp), (_applyDecoratedDescriptor(_class.prototype, '_onOverlayClick', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onOverlayClick'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'openDrawer', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'openDrawer'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'closeDrawer', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'closeDrawer'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_handleDrawerOpen', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_handleDrawerOpen'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_handleDrawerClose', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_handleDrawerClose'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_shouldSetPanResponder', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_shouldSetPanResponder'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_panResponderGrant', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_panResponderGrant'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_panResponderMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_panResponderMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_panResponderRelease', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_panResponderRelease'), _class.prototype)), _class);exports.default = DrawerLayout;




var styles = StyleSheet.create({ 
  drawer: { 
    position: 'absolute', 
    top: 0, 
    bottom: 0 }, 

  main: { 
    flex: 1 }, 

  overlay: { 
    backgroundColor: '#000', 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    bottom: 0, 
    right: 0 } });