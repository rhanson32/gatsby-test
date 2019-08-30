import React from 'react';
import { connect } from 'react-redux';
import ChartistGraph from 'react-chartist';

const _ = require('lodash');
 
class Line extends React.Component {

  render() {
    let data = this.props.metrics[this.props.selected];
    var options = {
        high: Math.max(..._.flattenDeep(data.series)) + 1,
        low: 0,
        height: '400px',
        showArea: true,
        showLine: true,
        showPoint: true,
      fullWidth: true
    };
 
    var type = 'Line'
 
    return (
      <div className="chartist-test">
        <ChartistGraph className={'ct-line'} data={data} options={options} type={type} style={{ opacity: "0.5", minHeight: "350px" }} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    metrics: state.metrics
  }
}

export default connect(mapStateToProps, null)(Line);