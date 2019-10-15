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
                    <div className="dashboard-module-item">
                        <div className="dashboard-module-item-header">{this.props.filter === "all" ? 'Purify Score' : this.props.filter === 'security' ? 'Security Score' : this.props.filter === 'waste' ? 'Waste Score' : 'Configuration Score'}</div>
                        <div className="dashboard-module-item-body">{this.props.filter === "all" ? this.props.metrics.PurifyScore : this.props.filter === 'security' ? this.props.metrics.SecurityScore : this.props.filter === 'waste' ? this.props.metrics.WasteScore : this.props.metrics.ConfigurationScore}</div>
                    </div>
                    <div className="dashboard-module-item">
                        <div className="dashboard-module-item-header">Violations</div>
                        <div className="dashboard-module-item-body">{this.props.filter === "all" ? this.props.metrics.Security.Violations + this.props.metrics.Waste.Violations + this.props.metrics.Configuration.Violations : this.props.filter === 'security' ? this.props.metrics.Security.Violations : this.props.filter === 'waste' ? this.props.metrics.Waste.Violations : this.props.metrics.Configuration.Violations}</div>
                    </div>
                    <div className="dashboard-module-item">
                        <div className="dashboard-module-item-header">Evaluations</div>
                        <div className="dashboard-module-item-body">{this.props.filter === "all" ? this.props.metrics.Security.Evaluations + this.props.metrics.Waste.Evaluations + this.props.metrics.Configuration.Evaluations : this.props.filter === 'security' ? this.props.metrics.Security.Evaluations : this.props.filter === 'waste' ? this.props.metrics.Waste.Evaluations : this.props.metrics.Configuration.Evaluations}</div>
                    </div>
                    <div className="dashboard-module-item">
                        <div className="dashboard-module-item-header">Active Rules</div>
                        <div className="dashboard-module-item-body">{this.props.rules && this.props.rules.length > 0 ? this.props.filter === "all" ? this.props.rules.filter(rule => rule.Enabled).length : this.props.filter === 'security' ? this.props.rules.filter(rule => rule.Enabled && rule.Category === 'Security').length : this.props.filter === 'waste' ? this.props.rules.filter(rule => rule.Enabled && rule.Category === 'Waste').length : this.props.rules.filter(rule => rule.Enabled && rule.Category === 'Configuration').length  : ''}</div>
                    </div>
                    <div className="dashboard-module-item">
                        <div className="dashboard-module-item-header">Active Accounts</div>
                        <div className="dashboard-module-item-body">{this.props.accounts && this.props.accounts.length > 0 ? this.props.accounts.filter(account => account.Enabled).length : ''}</div>
                    </div>
                </div>
                <div className="dashboard-module-body">
                    <div className="dashboard-module-body-sidebar">
                        <div className="dashboard-sidebar-header">
                            Active Violations
                        </div>
                        <div className="dashboard-sidebar-body">
                            {this.props.rules.map(rule => {
                                return rule.Violations.filter(violation => violation.Status === 'Active').map(violation => 1).reduce((sum, num) => sum + num, 0);
                            }).reduce((sum, num) => sum + num, 0)}
                        </div>
                        <div className="dashboard-sidebar-header">
                            Deferred Violations
                        </div>
                        <div className="dashboard-sidebar-body">
                            {this.props.rules.map(rule => {
                                return rule.Violations.filter(violation => violation.Status === 'Deferred').map(violation => 1).reduce((sum, num) => sum + num, 0);
                            }).reduce((sum, num) => sum + num, 0)}
                        </div>
                        <div className="dashboard-sidebar-header">
                            Exempt Violations
                        </div>
                        <div className="dashboard-sidebar-body">
                            {this.props.rules.map(rule => {
                                return rule.Violations.filter(violation => violation.Status === 'Exempt').map(violation => 1).reduce((sum, num) => sum + num, 0);
                            }).reduce((sum, num) => sum + num, 0)}
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