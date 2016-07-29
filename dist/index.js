var ReactNative = require('react-native');var 
Platform = ReactNative.Platform;var DrawerLayoutAndroid = ReactNative.DrawerLayoutAndroid;

if (Platform.OS === 'android') {
  module.exports = DrawerLayoutAndroid;} else 
if (Platform.OS === 'ios') {
  module.exports = require('./DrawerLayout.ios').default;}