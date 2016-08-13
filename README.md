## react-native-drawer-layout [![Circle CI](https://circleci.com/gh/iodine/react-native-drawer-layout.svg?style=svg)](https://circleci.com/gh/iodine/react-native-drawer-layout)

A platform-agnostic drawer layout. Pure JavaScript implementation on iOS and native implementation on Android. Why? Because the drawer layout is a useful component regardless of the platform! And if you can use it without changing any code, that's perfect.

## Add it to your project

1. Run `npm install react-native-drawer-layout --save`
2. Import the component by using one of these:
  - `var DrawerLayout = require('react-native-drawer-layout');`
  - `import DrawerLayout from 'react-native-drawer-layout';`
3. Follow the [DrawerLayoutAndroid](https://facebook.github.io/react-native/docs/drawerlayoutandroid.html#content) docs -- the API is the same.

## Demo

![](https://raw.githubusercontent.com/iodine/react-native-drawer-layout/master/example.gif)

To run the demo please run `npm install` in the `DrawerLayoutExample/` directory and start the demo up from there like any other React Native application.

## Support

| React Native Version      | react-native-dismiss-keyboard Version |
|---------------------------|---------------------------------------|
| >= 11 & < 23              | < 1.0                                 |
| >= 23                     | >= 1.0                                |

If you experience any further restrictions with other versions, please let us know.

## Restrictions

- Currently, there is no support for setting the status bar color in iOS. If you know any workaround, we would be glad to see an idea or a PR.

## Release Notes

### 1.0

#### Breaking changes:

- This version may only be used with React Native >= 0.25

### 0.3

#### Breaking changes:
- The StatusBar is no longer dimmed by sliding the drawer layout automatically. To avoid this change you may use [StatusBarIOS.setHidden](https://facebook.github.io/react-native/docs/statusbarios.html#sethidden) in the [onDrawerSlide](https://facebook.github.io/react-native/docs/drawerlayoutandroid.html#ondrawerslide) callback.

## Contribution

Please make sure to run the tests before proposing a PR by running `npm test`.
