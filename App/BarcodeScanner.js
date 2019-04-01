import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Button, Text, Header, Left, Body, Right, Title, Form, Input, Item } from 'native-base';
import { Constants, Alert } from 'expo';
import { BarCodeScanner, Permissions } from 'expo';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import BarChart from './components/BarChart'

import { Dimensions } from 'react-native';
import firebase from "./firebase.js";


export default class User extends React.Component {
  static defaultProps = {
    user: {},
    scanInitial: false,
    navigate: (page) => {}
  }

  unsub = null;

  state = {
    hasCameraPermission: null,
    scanned: false
  }

  componentDidUpdate(prevProps, prevState) {
    if(!prevProps.scanInitial && this.props.scanInitial){
      this.handleBarCodeScanned();
    }
  }

  async componentDidMount() {
    if(this.props.scanInitial) {
      this.handleBarCodeScanned();
    }
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  handleBarCodeScanned = () => {
    if(this.unsub)
      return;

    this.setState({scanned: true})
    // TODO: check bar code
    firebase.database().ref('inProgress').set({status: 1, user: this.props.user.uid})
    this.unsub = firebase.database().ref("inProgress").on('value', (snapshot) => {
      try{
        let val = snapshot.val();
        if(val.status === 0){
          this.unsub();
          this.unsub = null;
          const label = val.imageTag
          let points;
          switch(label){
            case 'Recycling':
              points = 5;
              break;
            case 'Compost':
              points = 2;
              break;
            case 'Trash':
            default:
              points = 1;
              break;
          }
          console.log(val)
          alert(`Your item is sorted as ${val.imageTag}. You earned ${points} points!`)
          this.props.navigate("user");
        }
      }catch(e){
        //ignore
      }
    });
    
  }

  componentWillUnmount() {
    if(this.unsub) {
      this.unsub();
      this.unsub = null;
    }
  }

  render() {
    const { hasCameraPermission, scanned } = this.state;

    let view;
    if(scanned) {
      view = <Text>Scanned! Processing...</Text>
    } else if (hasCameraPermission === null) {
      view = <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      view = <Text>No access to camera</Text>;
    } else {
      view = <BarCodeScanner
          onBarCodeScanned={this.handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
      />
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
  }
});
