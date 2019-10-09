import React from 'react';
import Line from './Line';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button } from 'antd';

class DashboardModule extends React.Component {

    state = {
        selectedChart: 'last12Hours'
    }

    componentDidMount() {

    }

    last12Hours = () => {
        this.setState({ selectedChart: 'last12Hours' });
    }

    last3Days = () => {
        this.setState({ selectedChart: 'last3Days' });
    }

    last7Days = () => {
        this.setState({ selectedChart: 'last7Days' });
    }

    lastMonth = () => {
        this.setState({ selectedChart: 'lastMonth' });
    }

    last3Months = () => {
        this.setState({ selectedChart: 'last3Months' });
    }

    render() {
        return (
            <div className="dashboard-module">
                <div className="dashboard-module-header">
                    <div className="dashboad-module-item">
                        <div className="dashboard-module-item-header">Purify Score</div>
                        <div className="dashboard-module-item-body">{this.props.metrics.PurifyScore}</div>
                    </div>
                    <div className="dashboad-module-item">
                        <div className="dashboard-module-item-header">Violations</div>
                        <div className="dashboard-module-item-body">{this.props.metrics.Security ? this.props.metrics.Security.Violations + this.props.metrics.Waste.Violations + this.props.metrics.Configuration.Violations : ''}</div>
                    </div>
                    <div className="dashboad-module-item">
                        <div className="dashboard-module-item-header">Evaluations</div>
                        <div className="dashboard-module-item-body">{this.props.metrics.Security ? this.props.metrics.Security.Evaluations + this.props.metrics.Waste.Evaluations + this.props.metrics.Configuration.Evaluations : ''}</div>
                    </div>
                    <div className="dashboad-module-item">
                        <div className="dashboard-module-item-header">Active Rules</div>
                        <div className="dashboard-module-item-body">{this.props.rules && this.props.rules.length > 0 ? this.props.rules.filter(rule => rule.Enabled).length : ''}</div>
                    </div>
                    <div className="dashboad-module-item">
                        <div className="dashboard-module-item-header">Active Accounts</div>
                        <div className="dashboard-module-item-body">{this.props.accounts && this.props.accounts.length > 0 ? this.props.accounts.filter(account => account.Enabled).length : ''}</div>
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
                            <div className="history-chart-header-filters">
                                <div className={this.state.selectedChart === 'last12Hours' ? 'selectedLink' : null}> <Button onClick={this.last12Hours} type="link">Last 12 Hours</Button></div>
                                <div className={this.state.selectedChart === 'last3Days' ? 'selectedLink' : null}> <Button onClick={this.last3Days} type="link">Last 3 Days</Button></div>
                                <div className={this.state.selectedChart === 'last7Days' ? 'selectedLink' : null}>  <Button onClick={this.last7Days} type="link">Last 7 Days</Button></div>
                                {moment(parseInt(this.props.user.CreateDate)*1000).isBefore(moment().subtract(14, 'days')) && <div className={this.state.selectedChart === 'lastMonth' ? 'selectedLink' : null}>  <Button onClick={this.lastMonth}  type="link">Last Month</Button></div>}
                                {moment(parseInt(this.props.user.CreateDate)*1000).isBefore(moment().subtract(2, 'months')) && <div className={this.state.selectedChart === 'last3Months' ? 'selectedLink' : null}>  <Button onClick={this.last3Months} type="link">Last 3 Months</Button></div>}
                            </div>
                            
                            <Line selected={this.state.selectedChart} />
                            <div className="legend">
                                <div className="legend-one"></div><div>Violations Discovered</div>
                                <div className="legend-two"></div><div>Violations Resolved</div>
                            </div>
                        </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        metrics: state.metrics,
        rules: state.rules,
        accounts: state.accounts,
        user: state.user
    }
}

export default connect(mapStateToProps, null)(DashboardModule);