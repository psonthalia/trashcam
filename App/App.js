import firebase from './firebase.js';
import React, { Component } from 'react';
import { TextInput, View, Button, Alert, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import User from './User.js'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.unsubscriber = null;
    this.state = {email: '', password:'', user: null, inputEmail: '', inputPassword: ''};
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

  componentDidMount(){
      this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
        if(user) {
          console.log(user)
          this.setState({email: user.email, user: user.uid});
        } else {
          this.setState({email: null, user: null});
        }
      });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() { 
    let view;
    if(this.state.email){
      view = <User email={this.state.email} user={this.state.uid}/>
    }else{
      view = (<View style={{padding: 30}}>
          <TextInput
            style={{height: 40}}
            placeholder="Email"
            onChangeText={(inputEmail) => this.setState({inputEmail})}
          />
          <TextInput
            secureTextEntry
            style={{height: 40}}
            placeholder="Password"
            onChangeText={(inputPassword) => this.setState({inputPassword})}
          />

          <Button
          onPress= {this.login}
          title="Login"
          color="#841584"
          />

          <Button
          onPress= {this.signUp}
          title="Sign Up"
          color="#841584"
          />
        </View>)
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
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  }
});