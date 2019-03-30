import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import BarChart from 'react-bar-chart';

const data = [
  {text: 'Compost', value: 500},
  {text: 'Recycling', value: 300},
  {text: 'Trash', value: 1000}
];

const margin = {top: 20, right: 20, bottom: 30, left: 40};

class App extends Component {
  render() {
    return (
      <div>
        <BarChart yLabel='Quantity'
          width={500}
          height={500}
          margin={margin}
          data={data}
        />
      </div>
    );
  }
}

export default App;
