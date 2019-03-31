import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Button, Text, Header, Left, Body, Right, Title, Form, Input, Item } from 'native-base';
import { Constants } from 'expo';
import { BarCodeScanner, Permissions } from 'expo';
import Redeem from './redeem.js';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
import {
  BarChart
} from 'react-native-chart-kit'

import { Dimensions } from 'react-native';
import firebase from "./firebase.js";


export default class User extends React.Component {
  state = {
    points: 0,
    data: 
      {
        labels: ['Trash', 'Compost', 'Recycling'],
        datasets: [{
          data: [ 0, 0, 0 ]
        }]
      },
    snapshot: {
      Compost:{},
      Recycling: {},
      Trash: {}
    },
    scanning: false,
    hasCameraPermission: null,
    redeeming: false
  }

  async componentDidMount() {
    firebase.database().ref(this.props.user.uid).on('value', (snapshot) => {
      const numTrash = snapshot.child('Trash').numChildren()
      const numRecycle = snapshot.child('Recycling').numChildren()
      const numCompost = snapshot.child('Compost').numChildren()
      this.setState({
        data: {
          labels: ['Trash', 'Recycling', 'Compost'],
          datasets: [{
            data: [
              numTrash, 
              numRecycle, 
              numCompost
            ]
          }]
        },
        snapshot: snapshot.val(),
        points: 5*numRecycle + 2*numCompost + numTrash
      });
    });

    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  onScanPress = () => {
    this.setState({scanning: true})
  }

  onRedeemPress = () => {
    this.setState({redeeming: true})
  }

  handleBarCodeScanned = () => {
    // TODO: check bar code
    firebase.database().ref('inProgress').set({status: 1, user: this.props.user.uid})
    this.setState({scanning: false})
  }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    const screenWidth = Dimensions.get('window').width;
    const chartConfig = {
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2, // optional, default 3,
      decimalPlaces: 0
    };
    let view;
    if (this.state.scanning) {
      if (hasCameraPermission == null) {
        view = <Text>Requesting camera permission</Text>
      } else if (hasCameraPermission == false) {
        view = <Text>No access to camera</Text>
      } else {
        view = <BarCodeScanner
                onBarCodeScanned={this.handleBarCodeScanned}
                style={StyleSheet.absoluteFill}
              />
      }
    } else if (this.state.redeeming) {
      view = <Redeem />
    } else {
      view = <View>
              <BarChart
                style={{ marginVertical: 8, borderRadius: 16}}
                data={this.state.data}
                width={screenWidth-16}
                height={220}
                yAxisLabel={''}
                chartConfig={chartConfig}
              />
              <Button style={styles.scanButton} onPress={this.onScanPress}><Text>Scan QR Code</Text></Button>
              <Text style={styles.points}>
                {this.state.points} points
              </Text>
              <Button style={styles.redeemButton} onPress={this.onRedeemPress}><Text>Redeem</Text></Button>
            </View>
    }

    return (
      <View style={styles.container}>
        {view}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    alignItems: 'center'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  points: {
    textAlign: 'center',
    margin: 24,
    fontSize: 24
  },
  scanButton: {
    alignSelf: 'center'
  },
  redeemButton: {
    alignSelf: 'center'
  }
});
