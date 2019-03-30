import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import firebase from "./firebase.js";

import {ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar} from 'recharts';

const margin = {top: 20, right: 20, bottom: 30, left: 40};

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [
        {name: 'Bins', Trash: 0, Recycling: 0, Compost: 0}
      ],
      snapshot: {
        Compost:{},
        Recycling: {},
        Trash: {}
      },
      width: 500
    }
  }

  componentDidMount() {
    //initial width
    this.setState({width: this.refs.root.offsetWidth});
    window.onresize = () => {
      this.setState({width: this.refs.root.offsetWidth});
    };

    firebase.database().ref('TestData').on('value', (snapshot) => {
      this.setState({
        data: [
          {name: 'Bins',
            Compost: snapshot.child('Compost').numChildren(),
          Recycling: snapshot.child('Recycling').numChildren(),
          Trash: snapshot.child('Trash').numChildren()}
        ],
        snapshot: snapshot.val()
      });
    });
  }

  render() {

    return (
      <div ref="root">
        <div className="toolbar">
          Smart Sort
        </div>

        <div className="content">

          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={this.state.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Trash" fill="#000000" />
                <Bar dataKey="Recycling" fill="#82ca9d" />
                <Bar dataKey="Compost" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
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
