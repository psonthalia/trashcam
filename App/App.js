import firebase from './firebase.js';
import React, { Component } from 'react';
import { TextInput, View, Alert, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import User from './User.js'
import { Container, Button, Text, Header, Left, Body, Right, Title, Form, Input, Item, Icon} from 'native-base';

import { Font, Linking } from 'expo';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.unsubscriber = null;
    this.state = {user: null, inputEmail: '', inputPassword: '', isReady: false, scanInitial: false};
  }

  login = () => {
    var email = this.state.inputEmail;
    var password = this.state.inputPassword;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
  }

  signUp = () => {
      var email = this.state.inputEmail;
      var password = this.state.inputPassword;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }

  async componentWillMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ isReady: true });
  }

  async componentDidMount(){
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.setState({user});
      } else {
        this.setState({user: null});
      }

      Linking.getInitialURL().then((url) => {
        let { path, queryParams } = Expo.Linking.parse(url);
        //alert(JSON.stringify(queryParams))
        if(Object.keys(queryParams).length != 0){
          this.setState({scanInitial: true})
        }
      })
    });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  onSignoutPressed = () => {
    firebase.auth().signOut();
  }

  render() { 
    let view;
    if(this.state.user){
      view = <User user={this.state.user} scanInitial={this.state.scanInitial}/>
    }else{
      view = (
      <View style={styles.container}>
        <Form>
          <Item>
            <Input 
              placeholder="Email" 
              autoComplete="email"
              onChangeText={(inputEmail) => this.setState({inputEmail})}
            />
          </Item>
          <Item last>
            <Input 
              secureTextEntry
              placeholder="Password" 
              onChangeText={(inputPassword) => this.setState({inputPassword})}/>
          </Item>
        </Form>

        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            onPress= {this.login}
            color="#841584">
            <Text>Login</Text>
          </Button>

          <Button
            style={styles.button}
            onPress= {this.signUp}
            color="#841584">
            <Text>Sign Up</Text>
          </Button>
        </View>
      </View>
      )
    }

    return (
      this.state.isReady ? 
      <Container>
        <Header>
          <Left/>
          <Body>
            <Title>Trash Cam</Title>
          </Body>
          <Right>
            {this.state.user ? (<Button transparent onPress={this.onSignoutPressed}>
              <Icon name='exit' />
            </Button>) : null}
          </Right>
        </Header>
        {view}
      </Container>
      : <Expo.AppLoading />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },
  button: {
    margin: 16
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  }
});