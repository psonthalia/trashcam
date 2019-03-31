import React, { Component } from 'react';
import './App.css';

import firebase from "./firebase.js";

import {ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar} from 'recharts';

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
      snapshotFiltered: {
        Compost:{},
        Recycling: {},
        Trash: {}
      },
      width: 500,
      timeSpan: 'All Time',
    }

    this.getTimespan = this.getTimespan.bind(this);
  }

  componentDidMount() {
    //initial width
    this.setState({width: this.refs.root.offsetWidth});
    window.onresize = () => {
      this.setState({width: this.refs.root.offsetWidth});
    };

    firebase.database().ref('TestData').on('value', (snapshot) => {
      this.setState({
        snapshot: snapshot.val()
      });
      this.getTimespan(null, snapshot.val())
    });
  }

  getTimespan(event, snapshot) {
    snapshot = snapshot ? snapshot : this.state.snapshot;
    let timeSpan = event ? event.target.value : this.state.timeSpan;
    var trash = 0;
    var recycling = 0;
    var compost = 0;
    let snapshotFiltered = {Recycling: {}, Trash: {}, Compost: {}};

    if (timeSpan === "All Time") {
      trash = Object.keys(snapshot.Trash).length;
      recycling = Object.keys(snapshot.Recycling).length;
      compost = Object.keys(snapshot.Compost).length;
      snapshotFiltered = snapshot;
    } else {
      let threshold;
      if (timeSpan === "Past Week") {
        threshold = 7 * 24 * 3600 * 1000;
      } else {  //Past Day
        threshold = 24 * 3600 * 1000;
      }
      for (const key of Object.keys(snapshot.Trash)) {
        const date = new Date(key);
        if (Date.now() - date.getTime() < threshold) {
          snapshotFiltered.Trash[key] = snapshot.Trash[key];
          trash++;
        }
      }
      for (const key of Object.keys(snapshot.Recycling)) {
        const date = new Date(key);
        if (Date.now() - date.getTime() < threshold) {
          snapshotFiltered.Recycling[key] = snapshot.Recycling[key];
          recycling++;
        }
      }
      for (const key of Object.keys(snapshot.Compost)) {
        const date = new Date(key);
        if (Date.now() - date.getTime() < threshold) {
          snapshotFiltered.Compost[key] = snapshot.Compost[key];
          compost++;
        }
      }
    }


    this.setState({
      timeSpan: timeSpan,
      data: [
        {name: 'Bins', Trash: trash, Recycling: recycling, Compost: compost}
      ],
      snapshotFiltered: snapshotFiltered
    });
  }

  process

  render() {

    return (
      <div ref="root">
        <div className="toolbar">
          <div className="title">Trash Cam</div>
          <select className="selectTime" value={this.state.timeSpan} onChange={this.getTimespan}>
            <option value='Past Day'>Past Day</option>
            <option value='Past Week'>Past Week</option>
            <option value='All Time'>All Time</option>
          </select>
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
                Object.values(this.state.snapshotFiltered.Compost).map(item =>
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
                Object.values(this.state.snapshotFiltered.Recycling).map(item =>
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
                Object.values(this.state.snapshotFiltered.Trash).map(item =>
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
