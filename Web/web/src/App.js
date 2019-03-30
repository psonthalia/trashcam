import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import firebase from "./firebase.js";

import BarChart from 'react-bar-chart';

const margin = {top: 20, right: 20, bottom: 30, left: 40};

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [
        {text: 'Compost', value: 500},
        {text: 'Recycling', value: 300},
        {text: 'Trash', value: 800}
      ],
    }
  }

  componentWillMount() {
    firebase.database().ref('TestData').on('value', (snapshot) => {
      this.setState({data: [
        {text: 'Compost', value: snapshot.child('Compost').numChildren()},
        {text: 'Recycling', value: snapshot.child('Recycling').numChildren()},
        {text: 'Trash', value: snapshot.child('Trash').numChildren()}
      ]});
    });
  }

  render() {
    return (
      <div>
        <BarChart yLabel='Quantity'
          width={500}
          height={500}
          margin={margin}
          data={this.state.data}
        />
      </div>
    );
  }
}

export default App;
