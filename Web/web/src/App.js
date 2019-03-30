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
        {text: 'Compost', value: 0},
        {text: 'Recycling', value: 0},
        {text: 'Trash', value: 0}
      ],
      snapshot: {
        Compost:{},
        Recycling: {},
        Trash: {}
      }
    }
  }

  componentWillMount() {
    firebase.database().ref('TestData').on('value', (snapshot) => {
      this.setState({
        data: [
          {text: 'Compost', value: snapshot.child('Compost').numChildren()},
          {text: 'Recycling', value: snapshot.child('Recycling').numChildren()},
          {text: 'Trash', value: snapshot.child('Trash').numChildren()}
        ],
        snapshot: snapshot.val()
      });
    });
  }

  render() {

    return (
      <div>
        <div className="toolbar">
          Smart Sort
        </div>

        <div className="content">

          <div className="chart">
          <BarChart yLabel='Quantity'
            width={500}
            height={500}
            margin={margin}
            data={this.state.data}
          />
          </div>

          <div className="clist">
            <h5>Compost</h5>
            <ul>
              {
                Object.values(this.state.snapshot.Compost).map(item =>
                    <li key={item}>
                      {item}
                    </li>
                )
              }
            </ul>
          </div>

          <div className="rlist">
            <h5>Recycling</h5>
            <ul>
              {
                Object.values(this.state.snapshot.Recycling).map(item =>
                    <li key={item}>
                      {item}
                    </li>
                )
              }
            </ul>
          </div>

          <div className="tlist">
            <h5>Trash</h5>
            <ul>
              {
                Object.values(this.state.snapshot.Trash).map(item =>
                    <li key={item}>
                      {item}
                    </li>
                )
              }
            </ul>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
