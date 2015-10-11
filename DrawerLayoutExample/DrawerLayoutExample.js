'use strict';

var React = require('react-native');
var { View, Text, StyleSheet, TouchableHighlight } = React;
var DrawerLayout = require('react-native-drawer-layout');

var DrawerLayoutExample = React.createClass({

  getInitialState() {
    return {};
  },

  render: function() {
    var navigationView = (
      <View style={[styles.container, {backgroundColor: '#fff'}]}>
        <Text>Hello there!</Text>
        <TouchableHighlight onPress={() => this.drawer.closeDrawer()}>
          <Text>Close drawer</Text>
        </TouchableHighlight>
      </View>
    );

    return (
      <DrawerLayout
        onDrawerSlide={(e) => this.setState({drawerSlideOutput: JSON.stringify(e.nativeEvent)})}
        onDrawerStateChanged={(e) => this.setState({drawerStateChangedOutput: JSON.stringify(e)})}
        drawerWidth={300}
        ref={(drawer) => { return this.drawer = drawer  }}
        renderNavigationView={() => navigationView}>
        <View style={styles.container}>
          <Text style={styles.welcome}>Content!</Text>
          <Text>{this.state.drawerStateChangedOutput}</Text>
          <Text>{this.state.drawerSlideOutput}</Text>
          <TouchableHighlight onPress={() => this.drawer.openDrawer()}>
            <Text>Open drawer</Text>
          </TouchableHighlight>
        </View>
      </DrawerLayout>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

module.exports = DrawerLayoutExample;
