const React = require('react');
const { Platform, DrawerLayoutAndroid } = React;

if (Platform.OS === 'android') {
  module.exports = DrawerLayoutAndroid;
} else if (Platform.OS === 'ios') {
  module.exports = require('./DrawerLayout.ios').default;
}
