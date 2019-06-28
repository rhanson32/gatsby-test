import React from 'react';
import { connect } from 'react-redux';
import { Spin, Card, Progress, Table, Statistic } from 'antd';

import LeftMenu from './LeftMenu';
import Header from './Header';
import { getCurrentUser, getRules, getAccounts, fetchUsers } from '../actions';

import 'antd/dist/antd.css';

class Dashboard extends React.Component {

    state = {
    }

    componentDidMount = async () => {
        if(!this.props.user.email)
        {
            await this.props.getCurrentUser();
            await this.props.getRules(this.props.user);
            this.setState({
                securityViolations: this.props.rules.filter(rule => rule.Category === 'Security').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0),
                wasteViolations: this.props.rules.filter(rule => rule.Category === 'Waste').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0),
                configurationViolations: this.props.rules.filter(rule => rule.Category === 'Configuration').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0),
                securityEvaluations: this.props.rules.filter(rule => rule.Category === 'Security').map(rule => rule.Scanned).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0),
                wasteEvaluations: this.props.rules.filter(rule => rule.Category === 'Waste').map(rule => rule.Scanned).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0),
                configurationEvaluations: this.props.rules.filter(rule => rule.Category === 'Configuration').map(rule => rule.Scanned).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0)
            })
            this.props.getAccounts(this.props.user.CustomerId);
            this.props.fetchUsers(this.props.user.CustomerId);
        }
        else
        {
            await this.props.getRules(this.props.user);
            this.setState({
                securityViolations: this.props.rules.filter(rule => rule.Category === 'Security').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0),
                wasteViolations: this.props.rules.filter(rule => rule.Category === 'Waste').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0),
                configurationViolations: this.props.rules.filter(rule => rule.Category === 'Configuration').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0),
                securityEvaluations: this.props.rules.filter(rule => rule.Category === 'Security').map(rule => rule.Scanned).reduce((accumulator, currentValue, currentIndex, array) => {
                     return accumulator + currentValue;
                 }, 0),
                wasteEvaluations: this.props.rules.filter(rule => rule.Category === 'Waste').map(rule => rule.Scanned).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0),
                configurationEvaluations: this.props.rules.filter(rule => rule.Category === 'Configuration').map(rule => rule.Scanned).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0)
            });
            this.props.getAccounts(this.props.user.CustomerId);
            this.props.fetchUsers(this.props.user.CustomerId);
        }
    }

    render() {
        const dataSourceSecurity = this.props.rules.filter(rule => rule.Category === 'Security').map((rule, index) => {
            return {
                key: index.toString(),
                name: rule.Name,
                category: rule.Category,
                id: rule.RuleId,
                status:  rule.Violations.length === 0 ? "Compliant": "Non-Compliant",
                violations: rule.Violations.length,
                description: rule.Description
            }    
        });

        const dataSourceConfiguration = this.props.rules.filter(rule => rule.Category === 'Configuration').map((rule, index) => {
            return {
                key: index.toString(),
                name: rule.Name,
                category: rule.Category,
                id: rule.RuleId,
                status:  rule.Violations.length === 0 ? "Compliant": "Non-Compliant",
                violations: rule.Violations.length,
                description: rule.Description
            }    
        });

        const dataSourceWaste = this.props.rules.filter(rule => rule.Category === 'Waste').map((rule, index) => {
            return {
                key: index.toString(),
                name: rule.Name,
                category: rule.Category,
                id: rule.RuleId,
                status:  rule.Violations.length === 0 ? "Compliant": "Non-Compliant",
                violations: rule.Violations.length,
                description: rule.Description
            }    
        });
          
          const columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
                sorter: (a, b) => a.name.length - b.name.length,
                sortDirections: ['descend', 'ascend']
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status'
            },
            {
                title: 'Violations',
                dataIndex: 'violations',
                key: 'violations',
                sorter: (a, b) => a.violations - b.violations,
            },
            {
              title: '',
              dataIndex: 'action',
              key: 'action'
            },
          ];
        return (
            <div className="dashboard-page">
                <Header />
                <LeftMenu />

                {
                    this.props.rules.length !== 0 && (
                        <div className="dashboard">
                            {
                                this.props.rules.length === 0 && <Spin style={{ margin: "auto" }} size="large" />
                            }
                            <Card style={{ margin: "2rem auto", width: "90%", maxWidth: "1400px" }} title={<div className="dashboard-card-header"><div>Category Metrics</div></div>} headStyle={{ fontSize: "1.6rem" }}>
                                <div className="progress-items">
                                <Progress style={{ margin: "1rem" }} type="dashboard" format={() => <div className="progress-text">{Math.round(this.props.rules.filter(rule => rule.Category === 'Security' && rule.Violations.length === 0).length * 100 / this.props.rules.filter(rule => rule.Category === "Security").length)}%<br />Security</div>} percent={Math.round(this.props.rules.filter(rule => rule.Category === 'Security' && rule.Violations.length === 0).length * 100 / this.props.rules.filter(rule => rule.Category === "Security").length)} width={300} strokeColor={Math.round(this.props.rules.filter(rule => rule.Category === 'Security' && rule.Violations.length === 0).length * 100 / this.props.rules.filter(rule => rule.Category === "Security").length) > 90 ? "green" : "red"} />
                                <Progress style={{ margin: "1rem" }} type="dashboard" format={() => <div className="progress-text">{Math.round(this.props.rules.filter(rule => rule.Category === 'Waste' && rule.Violations.length === 0).length * 100 / this.props.rules.filter(rule => rule.Category === "Waste").length)}%<br />Waste</div>} percent={Math.round(this.props.rules.filter(rule => rule.Category === 'Waste' && rule.Violations.length === 0).length * 100 / this.props.rules.filter(rule => rule.Category === "Waste").length)} width={300} strokeColor={"red"} />
                                <Progress style={{ margin: "1rem" }} type="dashboard" format={() => <div className="progress-text">{Math.round(this.props.rules.filter(rule => rule.Category === 'Configuration' && rule.Violations.length === 0).length * 100 / this.props.rules.filter(rule => rule.Category === "Configuration").length)}%<br />Configuration</div>} percent={Math.round(this.props.rules.filter(rule => rule.Category === 'Configuration' && rule.Violations.length === 0).length * 100 / this.props.rules.filter(rule => rule.Category === "Configuration").length)} width={300} strokeColor={"red"} />
                                </div>
                            </Card>
                            <div className="dashboard-categories">
                                <div className="dashboard-cards">
                                    <div className="dashboard-card">
                                    <Card headStyle={{ backgroundColor: "green", color: 'white' }} title="Security" style={{ margin: "1%" }}>
                                        <div className="dashboard-card-statistics">
                                            <Statistic title="Violations" value={this.state.securityViolations} style={{ margin: "0.5rem 1rem" }} />
                                            <Statistic title="Assets Evaluated" value={this.state.securityEvaluations} style={{ margin: "0.5rem 1rem" }} />
                                        </div>
                                        <Table size="middle" pagination={{ position: "top" }} style={{ width: "100%", margin: "auto" }} dataSource={dataSourceSecurity} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />
                                    </Card>
                                    </div>
                                    <div className="dashboard-card">
                                    <Card headStyle={{ backgroundColor: "blue", color: 'white' }} title="Configuration" style={{ margin: "1%" }}>
                                    <div className="dashboard-card-statistics">
                                        <Statistic title="Violations" value={this.state.configurationViolations} style={{ margin: "0.5rem 1rem" }} />
                                        <Statistic title="Assets Evaluated" value={this.state.configurationEvaluations} style={{ margin: "0.5rem 1rem" }} />
                                    </div>
                                        <Table size="middle" pagination={{ position: "top" }} style={{ width: "100%", margin: "auto" }} dataSource={dataSourceConfiguration} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />
                                    </Card>
                                    </div>
                                    <div className="dashboard-card">
                                        <Card headStyle={{ backgroundColor: "purple", color: 'white' }} title="Waste" style={{ margin: "1%" }}>
                                            <div className="dashboard-card-statistics">
                                                <Statistic title="Violations" value={this.state.wasteViolations} style={{ margin: "0.5rem 1rem" }} />
                                                <Statistic title="Assets Evaluated" value={this.state.wasteEvaluations} style={{ margin: "0.5rem 1rem" }} />
                                            </div>
                                            <Table size="middle" pagination={{ position: "top" }} style={{ width: "100%", margin: "auto" }} dataSource={dataSourceWaste} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
               
            </div>
        )
    } 
}

const mapStateToProps = state => {
    return {
        user: state.user,
        rules: state.rules
    }
}

export default connect(mapStateToProps, { getCurrentUser, getRules, getAccounts, fetchUsers })(Dashboard);