import React from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

const BarChart = ({ data, axis }) =>
  <C3Chart data={{ json: data, type: 'bar', x: 'x', xFormat: '%Y-%m-%d' }} axis={{ x: axis }} />;

export default BarChart;