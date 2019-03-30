/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
// import { AreaChart, Grid } from 'react-native-svg-charts'
// import * as shape from 'd3-shape'

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  ProgressViewIOS,
  TouchableHighlight,
} from 'react-native'

class Project extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to ThrowBack, Pranshu!
        </Text>
        <Text style={styles.instructions}>
          You have 87 points right now.
        </Text>
        <Text style={styles.instructions}>
          Points to next reward:
        </Text>
        <ProgressViewIOS 
          style={{
            margin: 9,
            width: 303,
          }}
          progress={90 / 100}
          progressTintColor={"rgba(43,66,190,0.67)"} 
        />
        <Image 
          style={{
            width: 280,
            height: 258,
          }}
          resizeMode={"contain"}
          source={{uri:'https://unsplash.it/600/400/?random'}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 30,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Project', () => Project);
