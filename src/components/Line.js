import React from 'react';
import ChartistGraph from 'react-chartist';

const _ = require('lodash');
 
class Line extends React.Component {
  render() {
 
    var data = {
      labels: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun', 'Mon', 'Tues', 'Wed'],
      series: [
        [1, 2, 4, 8, 6, 2, 1, 4, 16, 2],
        [6, 2, 4]
      ]
    };
    console.log(data.series);
    console.log(_.flattenDeep(data.series))
    console.log(Math.max(..._.flattenDeep(data.series)));
    var options = {
        high: Math.max(..._.flattenDeep(data.series)) + 2,
        low: 0,
        height: '400px',
        showArea: true,
        showLine: true,
        showPoint: true
    };
 
    var type = 'Line'
 
    return (
      <div className="chartist-test">
        <ChartistGraph className={'ct-line'} data={data} options={options} type={type} style={{ opacity: "0.5", minHeight: "350px" }} />
      </div>
    )
  }
}

export default Line;