import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { isLoggedIn } from '../utils/auth'
import { Spin, Card, Progress, Table, Statistic, Modal } from 'antd';

import LeftMenu from './LeftMenu';
import Header from './Header';
import { getCurrentUser, getRules, getAccounts, fetchUsers } from '../actions';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme, VictoryPie } from 'victory';

import 'antd/dist/antd.css';

class Dashboard extends React.Component {
    state = {
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
      };

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

            if(this.props.user.Status === "Cancelled")
            this.setState({ visible: true })
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

            if(this.props.user.Status === "Cancelled")
            this.setState({ visible: true })
        }
    }

    handleCancel = () => {
        Auth.signOut();
    }
    handleOk = () => {
        navigate('/app/login');
    }

    render() {
        console.log(this.state);
        console.log((1 - ((this.state.securityViolations + this.state.wasteViolations + this.state.configurationViolations) / (this.state.securityEvaluations + this.state.wasteEvaluations + this.state.configurationEvaluations))) * 100)
        if (!isLoggedIn()) navigate('/app/dashboard');
        const { visible, confirmLoading, ModalText } = this.state;

        const data = [
            {category: 'Security', violations: this.props.rules.filter(rule => rule.Category === 'Security').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                return accumulator + currentValue;
            }, 0)},
            {category: 'Waste', violations: this.props.rules.filter(rule => rule.Category === 'Waste').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                return accumulator + currentValue;
            }, 0)},
            {category: 'Configuration', violations: this.props.rules.filter(rule => rule.Category === 'Configuration').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                return accumulator + currentValue;
            }, 0)}
        ];

        const securityPie = [
            { x: "In Violation", y: this.props.rules.filter(rule => rule.Category === 'Security').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                return accumulator + currentValue;
            }, 0)},
            {
                x: "Compliant", y: this.props.rules.filter(rule => rule.Category === 'Security').map(rule => rule.Scanned).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0) - this.props.rules.filter(rule => rule.Category === 'Security').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0)
            }
        ];

        const wastePie = [
            { x: "In Violation", y: this.props.rules.filter(rule => rule.Category === 'Waste').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                return accumulator + currentValue;
            }, 0)},
            {
                x: "Compliant", y: this.props.rules.filter(rule => rule.Category === 'Waste').map(rule => rule.Scanned).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0) - this.props.rules.filter(rule => rule.Category === 'Waste').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0)
            }
        ];

        const configurationPie = [
            { x: "In Violation", y: this.props.rules.filter(rule => rule.Category === 'Configuration').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                return accumulator + currentValue;
            }, 0)},
            {
                x: "Compliant", y: this.props.rules.filter(rule => rule.Category === 'Configuration').map(rule => rule.Scanned).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0) - this.props.rules.filter(rule => rule.Category === 'Configuration').map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0)
            }
        ];

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
                {this.props.user.Status === "Cancelled" && (
                    <Modal
                    title="Inactive Account"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelText="Logout"
                  >
                    <p>{ModalText}</p>
                  </Modal>
                )}
                {
                    this.props.rules.length !== 0 && (
                        <div className="dashboard">
                            {
                                this.props.rules.length === 0 && <Spin style={{ margin: "auto" }} size="large" />
                            }
                            <Card style={{ margin: "2rem", maxWidth: "1200px" }} title={null} headStyle={{ fontSize: "1.6rem" }}>
                                <div className="dashboard-card-header"><div>PurifyScore</div></div>
                                <Progress format={percent => percent + " / 100"} percent={Math.round((1 - ((this.state.securityViolations + this.state.wasteViolations + this.state.configurationViolations) / (this.state.securityEvaluations + this.state.wasteEvaluations + this.state.configurationEvaluations))) * 100)} strokeWidth={20} style={{ paddingRight: "1rem" }} />
                            </Card>
                            <Card bodyStyle={{ paddingBottom: "4rem" }} style={{ margin: "2rem", width: "90%", maxWidth: "800px", borderRadius: "5px" }} title={null} headStyle={{ fontSize: "1.6rem" }}>
                            <div className="dashboard-card-header">
                                <div>Category Metrics</div>
                            </div>
                            <div className="progress-items">
                            <div className="victory-chart">
                                <VictoryPie
                                    animate={{ duration: 2000 }}
                                    innerRadius={90}
                                    radius={150}
                                    data={securityPie}
                                    colorScale={['#d63031', '#00b894']}
                                    labels={(d) => d.y}
                                    labelRadius={105}
                                    style={{ labels: { fill: "white", fontSize: 24, fontWeight: "bold" } }}
                                    />
                                    <div className="dashboard-chart-label">Security</div>
                            </div>
                            <div className="victory-chart">
                                <VictoryPie
                                     animate={{ duration: 2000 }}
                                     innerRadius={90}
                                     radius={150}
                                     data={wastePie}
                                     colorScale={['#d63031', '#00b894']}
                                     labels={(d) => d.y}
                                     labelRadius={105}
                                     style={{ labels: { fill: "white", fontSize: 20, fontWeight: "bold" } }}
                                    />
                                    <div className="dashboard-chart-label">Waste</div>
                            </div>
                            <div className="victory-chart">
                                <VictoryPie
                                     animate={{ duration: 2000 }}
                                     innerRadius={90}
                                     radius={150}
                                     data={configurationPie}
                                     colorScale={['#d63031', '#00b894']}
                                     labels={(d) => d.y}
                                     labelRadius={105}
                                     style={{ labels: { fill: "white", fontSize: 20, fontWeight: "bold" } }}
                                    />
                                    <div className="dashboard-chart-label">Configuration</div>
                            </div>
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
                                        <Table size="small" pagination={{ position: "top" }} style={{ width: "100%", margin: "auto" }} dataSource={dataSourceSecurity} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />
                                    </Card>
                                    </div>
                                    <div className="dashboard-card">
                                    <Card headStyle={{ backgroundColor: "blue", color: 'white' }} title="Configuration" style={{ margin: "1%" }}>
                                    <div className="dashboard-card-statistics">
                                        <Statistic title="Violations" value={this.state.configurationViolations} style={{ margin: "0.5rem 1rem" }} />
                                        <Statistic title="Assets Evaluated" value={this.state.configurationEvaluations} style={{ margin: "0.5rem 1rem" }} />
                                    </div>
                                        <Table size="small" pagination={{ position: "top" }} style={{ width: "100%", margin: "auto" }} dataSource={dataSourceConfiguration} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />
                                    </Card>
                                    </div>
                                    <div className="dashboard-card">
                                        <Card headStyle={{ backgroundColor: "purple", color: 'white' }} title="Waste" style={{ margin: "1%" }}>
                                            <div className="dashboard-card-statistics">
                                                <Statistic title="Violations" value={this.state.wasteViolations} style={{ margin: "0.5rem 1rem" }} />
                                                <Statistic title="Assets Evaluated" value={this.state.wasteEvaluations} style={{ margin: "0.5rem 1rem" }} />
                                            </div>
                                            <Table size="small" pagination={{ position: "top" }} style={{ width: "100%", margin: "auto" }} dataSource={dataSourceWaste} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />
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