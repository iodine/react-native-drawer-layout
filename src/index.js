import {
  Platform,
  DrawerLayoutAndroid,
} from 'react-native';

if (Platform.OS === 'android') {
  module.exports = DrawerLayoutAndroid;
} else {
  module.exports = require('./DrawerLayout.ios').default;
}
