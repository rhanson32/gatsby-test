import React from 'react';
import Line from './Line';
import { connect } from 'react-redux';

class DashboardModule extends React.Component {
    componentDidMount() {

    }

    render() {
        console.log(this.props);
        return (
            <div className="dashboard-module">
                <div className="dashboard-module-header">
                    <div className="dashboad-module-item">
                        <div className="dashboard-module-item-header">Purify Score</div>
                        <div className="dashboard-module-item-body">{this.props.metrics.PurifyScore}</div>
                    </div>
                    <div className="dashboad-module-item">
                        <div className="dashboard-module-item-header">Violations</div>
                        <div className="dashboard-module-item-body">{this.props.metrics.PurifyScore}</div>
                    </div>
                    <div className="dashboad-module-item">
                        <div className="dashboard-module-item-header">Evaluations</div>
                        <div className="dashboard-module-item-body">{this.props.metrics.PurifyScore}</div>
                    </div>
                    <div className="dashboad-module-item">
                        <div className="dashboard-module-item-header">Active Rules</div>
                        <div className="dashboard-module-item-body">{this.props.metrics.PurifyScore}</div>
                    </div>
                    <div className="dashboad-module-item">
                        <div className="dashboard-module-item-header">Active Accounts</div>
                        <div className="dashboard-module-item-body">{this.props.metrics.PurifyScore}</div>
                    </div>
                </div>
                <div className="dashboard-module-body">
                    <div className="dashboard-module-body-sidebar">
                        <div className="dashboard-sidebar-header">
                            New Violations
                        </div>
                        <div className="dashboard-sidebar-body">
                            35
                        </div>
                    </div>
                    <div className="dashboard-module-body-graph">
                        <div className="legend">
                            <div className="legend-one"></div><div>Violations Discovered</div>
                            <div className="legend-two"></div><div>Violations Resolved</div>
                        </div>
                        {this.props.metrics && this.props.metrics['last3Days'] && <Line selected={this.props.selected} />}
                   </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        metrics: state.metrics
    }
}

export default connect(mapStateToProps, null)(DashboardModule);