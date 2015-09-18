var React = require('react-native');
var { Platform } = React;

if (Platform.OS === 'android') {
  module.exports = require('./DrawerLayout.android');
} else if (Platform.OS === 'ios') {
  module.exports = require('./DrawerLayout.ios');
}
