import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { isLoggedIn, getExpiration } from '../utils/auth';
import { Spin, Card, Progress, Table, Statistic, Modal, Input, Button, message, DatePicker } from 'antd';

import LeftMenu from './LeftMenu';
import Header from './Header';
import { getCurrentUser, getRules, getAccounts, fetchUsers, updateCustomerStatus } from '../actions';
import { VictoryPie, VictoryChart, VictoryBar, VictoryAxis } from 'victory';
import moment from 'moment';

import 'antd/dist/antd.css';

class Dashboard extends React.Component {
    state = {
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
        welcomeScreen: false,
        account: ``,
        showAll: true,
        showSecurity: false,
        showWaste: false,
        showConfiguration: false,
        scanComplete: false
      };

    componentDidMount = async () => {
        if(moment(getExpiration()) < moment())
        {
            console.log("User session has expired");
            message.warning('Your session has expired. Redirecting to login page in 2 seconds.');
            setTimeout(async () => {
                await Auth.signOut();
                navigate('/app/login');
            }, 2000); 
        }
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
            await this.props.getAccounts(this.props.user.CustomerId);
            this.setState({ scanComplete: true });
            this.props.fetchUsers(this.props.user.CustomerId);

            if(this.props.user.Status === "Cancelled")
            this.setState({ visible: true })
            if(this.props.user.Status === "New")
            this.setState({ welcomeScreen: true })
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
            await this.props.getAccounts(this.props.user.CustomerId);
            this.setState({ scanComplete: true });
            this.props.fetchUsers(this.props.user.CustomerId);

            if(this.props.user.Status === "Cancelled")
                this.setState({ visible: true })
            if(this.props.user.Status === "New")
                this.setState({ welcomeScreen: true })
        }
    }

    showAll = () => {
        this.setState({
            showAll: true,
            showSecurity: false,
            showWaste: false,
            showConfiguration: false
        });
    }

    showSecurity = () => {
        this.setState({
            showAll: false,
            showSecurity: true,
            showWaste: false,
            showConfiguration: false
        });
    }

    showWaste = () => {
        this.setState({
            showAll: false,
            showSecurity: false,
            showWaste: true,
            showConfiguration: false
        });
    }

    showConfiguration = () => {
        this.setState({
            showAll: false,
            showSecurity: false,
            showWaste: false,
            showConfiguration: true
        });
    }

    handleCancel = () => {
        Auth.signOut();
    }
    handleOk = () => {
        navigate('/app/login');
    }

    handleDismiss = () => {
        this.props.updateCustomerStatus("Active");
        this.setState({ welcomeScreen: false })
    }

    handleSubmit = () => {

    }

    render() {
        if (!isLoggedIn()) navigate('/app/login');

        const { visible, confirmLoading, ModalText, welcomeScreen } = this.state;

        const sampleData = [
            { x: 1, y: 2 },
            { x: 2, y: 5 },
            { x: 3, y: 1 },
        ];

        const allPie = [
            { x: "In Violation", y: this.props.rules.map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                return accumulator + currentValue;
            }, 0)},
            {
                x: "Compliant", y: this.props.rules.map(rule => rule.Scanned).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0) - this.props.rules.map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0)
            }
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

        const dataSourceAll = this.props.rules.map((rule, index) => {
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
                <Modal
                    title="Welcome to Purify!"
                    visible={welcomeScreen}
                    onOk={this.handleSubmit}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleDismiss}
                    cancelText="Dismiss"
                >
                    <div className="new-account-modal">
                        <p>In order to get started quickly, please input the role information for your AWS master account below.</p>
                        <div className="new-account-modal-input">
                            <label>Account Id</label>
                            <Input value={this.state.account} onChange={this.handleChange}></Input>
                        </div>
                        <div className="new-account-modal-input">
                        <label>Role Name</label>
                        <Input></Input>
                        </div>
                        <p>Unsure how to deploy a role with sufficient permissions in your account? Use our CloudFormation template available <a href="#">here</a></p>
                    </div>
                </Modal>

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
                        <div className="dashboard">
                            {
                                !this.state.scanComplete && <div className="spin-container"><Spin tip="Loading..." style={{ margin: "auto", fontSize: "2rem" }} size="large" /></div>
                            }
                            {this.props.rules.length !== 0 && this.props.accounts.length !== 0 && this.state.scanComplete && (
                            <div className="dashboard-max">
                                <Card style={{ margin: "1.5rem", width: "100%" }} title={null} headStyle={{ fontSize: "1.6rem" }}>
                                    <div className="dashboard-card-header"><div>PurifyScore</div></div>
                                    <Progress format={percent => percent + " / 100"} percent={Math.round((1 - ((this.state.securityViolations + this.state.wasteViolations + this.state.configurationViolations) / (this.state.securityEvaluations + this.state.wasteEvaluations + this.state.configurationEvaluations))) * 100)} strokeWidth={20} style={{ paddingRight: "1rem" }} />
                                </Card>
                                {this.props.accounts.length === 0 && (<Card style={{ margin: "1.5rem", width: "100%" }}>
                                    No data available. Please enable some accounts to see data in your dashboard.
                                </Card>)}
                                <div className="web-metrics">
                                <Card bodyStyle={{ }} style={{ margin: "0 1.5rem", borderRadius: "5px" }} title={<div className="dashboard-card-header">
                                    <div>Category Metrics</div>
                                    <Button.Group>
                                        <Button type={this.state.showAll ? "primary" : "default"} onClick={this.showAll}>
                                            All
                                        </Button>
                                        <Button type={this.state.showSecurity ? "primary" : "default"} onClick={this.showSecurity}>
                                            Security
                                        </Button>
                                        <Button type={this.state.showWaste ? "primary" : "default"} onClick={this.showWaste}>
                                            Waste
                                        </Button>
                                        <Button type={this.state.showConfiguration ? "primary" : "default"} onClick={this.showConfiguration}>
                                            Configuration
                                        </Button>
                                    </Button.Group>
                                </div>} headStyle={{ fontSize: "1.6rem" }}>
                                <div className="progress-items">
                                    <div className="progress-header">
                                    {this.state.showAll && <div className="dashboard-chart-label">All Categories</div>}
                                    {this.state.showSecurity && <div className="dashboard-chart-label">Security</div>}
                                    {this.state.showConfiguration && <div className="dashboard-chart-label">Configuration</div>}
                                    {this.state.showWaste && <div className="dashboard-chart-label">Waste</div>}
                                        {this.state.showAll && this.state.scanComplete && <Statistic title="Violations" value={this.state.securityViolations + this.state.configurationViolations + this.state.wasteViolations} style={{ margin: "0.5rem 1rem" }} />}
                                        {this.state.showAll && this.state.scanComplete && <Statistic title="Evaluations" value={this.state.securityEvaluations + this.state.configurationEvaluations + this.state.wasteEvaluations} style={{ margin: "0.5rem 1rem" }} />}
                                        {this.state.showAll && this.state.scanComplete && <Statistic title="% Violations" value={Math.round((this.state.securityViolations + this.state.configurationViolations + this.state.wasteViolations) / (this.state.securityEvaluations + this.state.securityEvaluations + this.state.wasteEvaluations)* 100)} style={{ margin: "0.5rem 1rem" }} />}
                                        {this.state.showSecurity && this.state.scanComplete && <Statistic title="Violations" value={this.state.securityViolations} style={{ margin: "0.5rem 1rem" }} />}
                                        {this.state.showSecurity && this.state.scanComplete && <Statistic title="Evaluations" value={this.state.securityEvaluations} style={{ margin: "0.5rem 1rem" }} />}
                                        {this.state.showSecurity && this.state.scanComplete && <Statistic title="% Violations" value={Math.round(this.state.securityViolations / this.state.securityEvaluations * 100)} style={{ margin: "0.5rem 1rem" }} />}
                                        {this.state.showConfiguration && this.state.scanComplete && <Statistic title="Violations" value={this.state.configurationViolations} style={{ margin: "0.5rem 1rem" }} />}
                                        {this.state.showConfiguration && this.state.scanComplete && <Statistic title="Evaluations" value={this.state.configurationEvaluations} style={{ margin: "0.5rem 1rem" }} />}
                                        {this.state.showConfiguration && this.state.scanComplete && <Statistic title="% Violations" value={Math.round(this.state.configurationViolations / this.state.configurationEvaluations * 100)} style={{ margin: "0.5rem 1rem" }} />}
                                        {this.state.showWaste && this.state.scanComplete && <Statistic title="Violations" value={this.state.wasteViolations} style={{ margin: "0.5rem 1rem" }} />}
                                        {this.state.showWaste && this.state.scanComplete && <Statistic title="Evaluations" value={this.state.wasteEvaluations} style={{ margin: "0.5rem 1rem" }} />}
                                        {this.state.showWaste && this.state.scanComplete && <Statistic title="% Violations" value={Math.round(this.state.wasteViolations / this.state.wasteEvaluations * 100)} style={{ margin: "0.5rem 1rem" }} />}
                                                
                                    </div>
                                    {this.state.showAll && (
                                    <div className="victory-chart">
                                        <VictoryPie
                                            animate={{ duration: 2000 }}
                                            innerRadius={90}
                                            radius={150}
                                            data={allPie}
                                            colorScale={['#eee', '#00b894']}
                                            labels={(d) => d.y}
                                            labelRadius={105}
                                            style={{ labels: { fontSize: 24, fontWeight: "bold" } }}
                                            />
                                            
                                    </div>
                                    )
                                }
                                {this.state.showSecurity && (
                                    <div className="victory-chart">
                                        <VictoryPie
                                            animate={{ duration: 2000 }}
                                            innerRadius={90}
                                            radius={150}
                                            data={securityPie}
                                            colorScale={['#eee', '#00b894']}
                                            labels={(d) => d.y}
                                            labelRadius={105}
                                            style={{ labels: { fontSize: 24, fontWeight: "bold" } }}
                                            />
                                            
                                    </div>
                                    )
                                }
                                {this.state.showWaste && (
                                    <div className="victory-chart">
                                    <VictoryPie
                                        animate={{ duration: 2000 }}
                                        innerRadius={90}
                                        radius={150}
                                        data={wastePie}
                                        colorScale={['#eee', '#00b894']}
                                        labels={(d) => d.y}
                                        labelRadius={105}
                                        style={{ labels: { fontSize: 20, fontWeight: "bold" } }}
                                        />
                                        
                                    </div>
                                )}
                                {this.state.showConfiguration && (
                                    <div className="victory-chart">
                                    <VictoryPie
                                        animate={{ duration: 2000 }}
                                        innerRadius={90}
                                        radius={150}
                                        data={configurationPie}
                                        colorScale={['#eee', '#00b894']}
                                        labels={(d) => d.y}
                                        labelRadius={105}
                                        style={{ labels: { fontSize: 20, fontWeight: "bold" } }}
                                        />
                                        
                                    </div>
                                )}
                                {this.state.showAll && <Table size="small" pagination={{ position: "bottom", pageSize: 5 }} style={{ margin: "auto" }} dataSource={dataSourceAll} columns={columns} />}
                                {this.state.showSecurity && <Table size="small" pagination={{ position: "bottom", pageSize: 5 }} style={{ margin: "auto" }} dataSource={dataSourceSecurity} columns={columns} />}
                                {this.state.showConfiguration && <Table size="small" pagination={{ position: "bottom", pageSize: 5 }} style={{ margin: "auto" }} dataSource={dataSourceConfiguration} columns={columns} />}
                                {this.state.showWaste && <Table size="small" pagination={{ position: "bottom", pageSize: 5 }} style={{ margin: "auto" }} dataSource={dataSourceWaste} columns={columns} />}
                                </div> )}
                                {
                                    this.props.accounts.length === 0 && this.state.scanComplete && (
                                        <div className="data-missing-dashboard">
                                            No data available. Please enable some accounts to see data in your dashboard.
                                        </div>
                                    )
                                }
                                </Card>
                                </div>
                            <div className="dashboard-sidebar">
                            <Card style={{ marginBottom: "1rem" }} bodyStyle={{ display: "flex" }} title={null} headStyle={{ fontSize: "1.6rem" }}>
                                <Statistic title="Rules Enabled" value={this.props.rules.filter(rule => rule.Enabled).length} style={{ margin: "0.5rem 1rem", width: "50%" }} />
                                <Statistic title="Total Rules" value={this.props.rules.length} style={{ margin: "0.5rem 1rem", width: "50%" }} />
                            </Card>
                            <Card bodyStyle={{ display: "flex" }} title={null} headStyle={{ fontSize: "1.6rem" }}>
                            <Statistic title="Enabled Accounts" value={this.props.accounts.length} style={{ margin: "0.5rem 1rem", width: "50%" }} />
                            <Statistic title="Total Accounts" value={this.props.accounts.length} style={{ margin: "0.5rem 1rem", width: "50%" }} />
                            </Card>
                            
                            </div>
                            <Card style={{ width: "100%", margin: "1.5rem" }} title={
                                <div className="history-chart-header">
                                    <div className="history-chart-header-title">
                                        Violations Over Time
                                    </div>
                                    <div className="history-chart-header-filters">
                                        <Button type="link">Today</Button>
                                        <Button type="link">Last 7 Days</Button>
                                        <Button type="link">Last Month</Button>
                                        <DatePicker.RangePicker />
                                    </div>
                                </div>
                            }>
                                <VictoryChart
                                height={200}
                                domainPadding={50}
                                >
                                    <VictoryBar
                                        style={{ data: { fill: "#c43a31" } }}
                                        data={sampleData}
                                    />
                                    <VictoryAxis />
                                    <VictoryAxis dependentAxis />
                                </VictoryChart>
                            </Card>
                            
                            </div>
                            )}
                        </div>
                    
                }
            </div>
        )
    } 
}

const mapStateToProps = state => {
    return {
        user: state.user,
        rules: state.rules,
        accounts: state.accounts
    }
}

export default connect(mapStateToProps, { getCurrentUser, getRules, getAccounts, fetchUsers, updateCustomerStatus })(Dashboard);