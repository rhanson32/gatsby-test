import React from 'react';
import { connect } from 'react-redux';
import ChartistGraph from 'react-chartist';
 
class Pie extends React.Component {
    state = { data: {
                labels: [] 
            } 
        }
    componentDidMount() {
        let series = [];
        console.log(this.props);
        this.setState({
            data: { labels: this.props.accounts.map(account => account.AccountId) }
        });

        console.log(this.state);
        for(let i = 0; i < this.state.data.labels.length; i++)
        {
            series.push(this.props.rules.map(rule => {
                return rule.Violations.map(violation => violation.AccountId === this.state.data.labels[i]).reduce((a, b) => a + b, 0)
            }).reduce((a, b) => a + b));

            console.log(series);
        }
    }

  render() {
      let labels = this.props.accounts.map(account => account.AccountId);
      let series = labels.map(id => {
          return this.props.rules.map(rule => {
            return rule.Violations.map(violation => violation.AccountId === id).reduce((a, b) => a + b, 0)
        }).reduce((a, b) => a + b) });
    let data = {
        labels,
        series
    };

    var responsiveOptions = [
        ['screen and (min-width: 640px)', {
          chartPadding: 30,
          labelOffset: 100,
          labelDirection: 'explode',
          labelInterpolationFnc: function(value) {
            return value;
          }
        }],
        ['screen and (min-width: 1024px)', {
          labelOffset: 80,
          chartPadding: 20
        }]
      ];

    var options = {
        height: '300px',
        showArea: true,
        showLine: true,
        showPoint: true,
        fullWidth: true
    };
 
    var type = 'Pie'
 
    return (
      <div className="chartist-test">
        {this.props.rules.length === 0 ? '' : <ChartistGraph className={'ct-pie'} data={data} options={options} responsiveOptions={responsiveOptions} type={type} style={{ opacity: "0.5", minHeight: "350px" }} />}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    metrics: state.metrics,
    rules: state.rules,
    accounts: state.accounts
  }
}

export default connect(mapStateToProps, null)(Pie);