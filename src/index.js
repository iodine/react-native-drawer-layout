const ReactNative = require('react-native');
const { Platform, DrawerLayoutAndroid } = ReactNative;

if (Platform.OS === 'android') {
  module.exports = DrawerLayoutAndroid;
} else if (Platform.OS === 'ios') {
  module.exports = require('./DrawerLayout.ios').default;
}
