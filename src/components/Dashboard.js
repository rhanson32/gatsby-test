import React from 'react';
import { connect } from 'react-redux';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { isLoggedIn, getExpiration, logout } from '../utils/auth';
import { Spin, Table, Statistic, Modal, Input, Button, message, DatePicker, notification, Icon, Dropdown, Menu } from 'antd';
import { StatsCard, Tabs, Tab, Avatar, Card, Progress } from "tabler-react";
import "tabler-react/dist/Tabler.css";  
import TopMenu from './TopMenu';
import Header from './Header';
import { getCurrentUser, getRules, getAccounts, fetchUsers, updateCustomerStatus } from '../actions';
import { VictoryPie, VictoryChart, VictoryBar, VictoryAxis, VictoryLabel, VictoryAnimation } from 'victory';
import moment from 'moment';

import 'antd/dist/antd.css';

class Dashboard extends React.Component {
    
    constructor() {
        super();
        this.state = {
            ModalText: 'Content of the modal',
            visible: false,
            confirmLoading: false,
            welcomeScreen: false,
            account: ``,
            showAll: true,
            showSecurity: false,
            showWaste: false,
            showConfiguration: false,
            scanComplete: false,
            error: {
                title: ``,
                message: ``
            },
            securityPercent: 0, 
            percent: 0,
            data: this.getData(0),
            allData: this.getData(0),
            interval: 0,
            showDetail: false,
            last3days: false,
            last7days: false
          };
    }
    

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
        if(this.props.rules.length > 0)
        {
            this.setState({ 
                scanComplete: true
            });
        }
        if(!this.props.user.email)
        {
            try
            {
                await this.props.getCurrentUser();
                await this.props.getRules(this.props.user);
            }
            catch(err)
            {
                console.log(err.message);
                if(err.message === 'Network Error')
                {
                    notification['error']({
                        message: 'Network Error',
                        description: 'Unable to connect to the internet. Please check your internet connection and try again.'
                    });
                }
            }
            

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
            this.setState({
                securityPercent: Math.round(((this.state.securityEvaluations - this.state.securityViolations) / this.state.securityEvaluations) * 100),
                wastePercent: Math.round(((this.state.wasteEvaluations - this.state.wasteViolations) / this.state.wasteEvaluations) * 100),
                configurationPercent: Math.round(((this.state.configurationEvaluations - this.state.configurationViolations) / this.state.configurationEvaluations) * 100),
                percent: Math.round(((this.state.securityEvaluations + this.state.wasteEvaluations + this.state.configurationEvaluations - this.state.securityViolations - this.state.wasteViolations - this.state.configurationViolations) / (this.state.securityEvaluations + this.state.wasteEvaluations + this.state.configurationEvaluations)) * 100)
            });
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
            try
            {
                await this.props.getRules(this.props.user);
            }
            catch(err)
            {
                console.log(err);
            }
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
            
            this.setState({
                securityPercent: Math.round(((this.state.securityEvaluations - this.state.securityViolations) / this.state.securityEvaluations) * 100),
                wastePercent: Math.round(((this.state.wasteEvaluations - this.state.wasteViolations) / this.state.wasteEvaluations) * 100),
                configurationPercent: Math.round(((this.state.configurationEvaluations - this.state.configurationViolations) / this.state.configurationEvaluations) * 100),
                percent: Math.round(((this.state.securityEvaluations + this.state.wasteEvaluations + this.state.configurationEvaluations - this.state.securityViolations - this.state.wasteViolations - this.state.configurationViolations) / (this.state.securityEvaluations + this.state.wasteEvaluations + this.state.configurationEvaluations)) * 100)
            });

            await this.props.getAccounts(this.props.user.CustomerId);
            this.setState({ scanComplete: true });
            this.props.fetchUsers(this.props.user.CustomerId);

            if(this.props.user.Status === "Cancelled")
                this.setState({ visible: true })
            if(this.props.user.Status === "New")
                this.setState({ welcomeScreen: true })
        }
        this.setState({ interval: setInterval( async () => {
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
            console.log("Interval function invoked:", this.state.interval);
        }, 30000)});

        this.setState({
            data: this.getData(this.state.securityPercent),
            allData: this.getData(this.state.percent),
            wasteData: this.getData(this.state.wastePercent),
            configurationData: this.getData(this.state.configurationPercent)
          });
    }

    componentWillUnmount = () => {
        clearInterval(this.state.interval);
    }

    getData = (percent) => {
        return [{ x: 1, y: percent }, { x: 2, y: 100 - percent }];
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

    showDetail = (e) => {
        console.log(e.target.id);
        this.setState({
            showDetail: true,
            detailId: e.target.id
        });
    }

    hideDetail = () => {
        this.setState({
            showDetail: false
        })
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

        const data = {
            columns: [
              ['data1', 30, 200, 100, 400, 150, 250],
              ['data2', 50, 20, 10, 40, 15, 25]
            ],
            types: {
                data1: 'bar',
                data2: 'bar'
            }
          };

        const allPie = [
            { x: "In Violation", y: Math.round(this.props.rules.map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                return accumulator + currentValue;
            }, 0))},
            {
                x: "Compliant", y: Math.round(this.props.rules.map(rule => rule.Scanned).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0)) - Math.round(this.props.rules.map(rule => rule.Violations.length).reduce((accumulator, currentValue, currentIndex, array) => {
                    return accumulator + currentValue;
                }, 0))
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
                violations: rule.Violations,
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
                violations: rule.Violations,
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
                violations: rule.Violations,
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
                violations: rule.Violations,
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
                render: (text, record) => {
                    return (
                    <span>
                        {record.violations.length} 
                        {record.violations.length > 0 && <Button name={record.name} id={record.id} type="link" onClick={this.showDetail}>View</Button>}
                    </span>
                    )
                },
                key: 'violations',
                sorter: (a, b) => a.violations - b.violations,
            }
          ];

          const menu = (
              <Menu>
                  <Menu.Item>
                      Test
                  </Menu.Item>
              </Menu>
          )
        return (
            <div className="dashboard-page">
                    <Header />
                    {/* <Header.H2>
                        <div className="header" autoscroll="true">
                            <div className="header-title">
                                Purify Cloud
                            </div>
                            <div className="header-menu">
                                <div className="user-name">
                                    <Dropdown overlay={menu}>
                                        <div className="header-profile">
                                            <Avatar icon="users" />
                                            <div className="header-profile-names">
                                                {this.props.user && this.props.user.email ? ' ' + this.props.user.email : ' '}
                                                {"Administrator"}
                                            </div>
                                            
                                        </div>
                                    </Dropdown>
                                </div>
                                {
                                    isLoggedIn() && this.props.user.email && (
                                        <Button
                                            type="default"
                                            onClick={() => Auth.signOut().then(logout(() => navigate('/app/login'))).catch(err => console.log('error:', err))}
                                        >
                                            Sign Out
                                        </Button>
                                    )
                                }
                            </div>  
                        </div>
                        <TopMenu />
                    </Header.H2> */}
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
                                <div className="dashboard-title">Headline</div>
                                <div className="dashboard-headlines">
                                <div className="dashboard-score">
                                <Card>
                                    <Card.Body>
                                        <div style={{ fontSize: "20px", fontWeight: "bold", display: "flex", justifyContent: "center" }}>
                                            Purify Score
                                        </div>
                                        <div style={{ fontSize: "32px", fontWeight: "bold", display: "flex", justifyContent: "center", padding: "0.5rem 0" }}>
                                            62
                                        </div>
                                        <Progress>
                                            <Progress.Bar color="green" width={10}>
                                            </Progress.Bar>
                                        </Progress>
                                    </Card.Body>
                                </Card>
                                </div>
                                
                                <div className="card-wrapper">
                                <Card>
                                <Card.Body>
                                    <div className="card-metric-wrapper">
                                        {this.props.rules.filter(rule => rule.Enabled).length}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                    Active Rules
                                    </div>
                                </Card.Body>
                            </Card>
                            </div> 
                                         
                            <div className="card-wrapper">
                            <Card>
                                <Card.Body>
                                    <div className="card-metric-wrapper">
                                        {this.props.rules.length}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                    Available Rules
                                    </div>
                                </Card.Body>
                            </Card>
                            </div>
                            <div className="card-wrapper">
                                    <Card>
                                        <Card.Body>
                                            <div className="card-metric-wrapper">
                                                {this.props.accounts.filter(account => account.Enabled).length}
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                            Enabled Accounts
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            <div className="card-wrapper">
                                <Card>
                                    <Card.Body>
                                        <div className="card-metric-wrapper">
                                            {this.props.accounts.length}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                        Total Accounts
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                            </div>
                            <div className="dashboard-title">Category Metrics</div>
                                <div className="web-metrics">
                                <Card>
                                    <Card.Header>
                                    <div className="dashboard-card-header">
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
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                    <div className="progress-items">
                                    <div className="progress-header">
                                    {this.state.showAll && <div className="dashboard-chart-label">All Categories</div>}
                                    {this.state.showSecurity && <div className="dashboard-chart-label">Security</div>}
                                    {this.state.showConfiguration && <div className="dashboard-chart-label">Configuration</div>}
                                    {this.state.showWaste && <div className="dashboard-chart-label">Waste</div>}
                                        {this.state.showAll && this.state.scanComplete && <Statistic title="Violations" value={this.state.securityViolations + this.state.configurationViolations + this.state.wasteViolations} style={{ margin: "0.5rem 1rem" }} />}
                                        {this.state.showAll && this.state.scanComplete && <Statistic title="Evaluations" value={this.state.securityEvaluations + this.state.configurationEvaluations + this.state.wasteEvaluations} style={{ margin: "0.5rem 1rem" }} />}
                                        {this.state.showAll && this.state.scanComplete && <Statistic title="% Violations" value={Math.round((this.state.securityViolations + this.state.configurationViolations + this.state.wasteViolations) / (this.state.securityEvaluations + this.state.configurationEvaluations + this.state.wasteEvaluations)* 100)} style={{ margin: "0.5rem 1rem" }} />}
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
                                        <svg viewBox="0 0 400 400" width="100%" height="100%">
                                            <VictoryPie
                                                standalone={false}
                                                animate={{ duration: 1000 }}
                                                width={400} height={400}
                                                data={this.state.allData}
                                                innerRadius={120}
                                                cornerRadius={25}
                                                labels={() => null}
                                                style={{
                                                data: { fill: (d) => {
                                                    const color = d.y > 80 ? "green" : "red";
                                                    return d.x === 1 ? color : "transparent";
                                                    }
                                                }
                                                }}
                                            />
                                            <VictoryAnimation duration={1000} data={this.state}>
                                                {(newProps) => {
                                                return (
                                                    <VictoryLabel
                                                    textAnchor="middle" verticalAnchor="middle"
                                                    x={200} y={200}
                                                    text={`${Math.round(newProps.percent)}%`}
                                                    style={{ fontSize: 45 }}
                                                    />
                                                );
                                                }}
                                            </VictoryAnimation>
                                        </svg>    
                                    </div>
                                    )
                                }
                                {this.state.showSecurity && (
                                    <div className="victory-chart">
                                        <svg viewBox="0 0 400 400" width="100%" height="100%">
                                            <VictoryPie
                                                standalone={false}
                                                animate={{ duration: 1000 }}
                                                width={400} height={400}
                                                data={this.state.data}
                                                innerRadius={120}
                                                cornerRadius={25}
                                                labels={() => null}
                                                style={{
                                                data: { fill: (d) => {
                                                    const color = d.y > 80 ? "green" : "red";
                                                    return d.x === 1 ? color : "transparent";
                                                }
                                                }
                                                }}
                                            />
                                            <VictoryAnimation duration={1000} data={this.state}>
                                                {(newProps) => {
                                                return (
                                                    <VictoryLabel
                                                    textAnchor="middle" verticalAnchor="middle"
                                                    x={200} y={200}
                                                    text={`${Math.round(newProps.securityPercent)}%`}
                                                    style={{ fontSize: 45 }}
                                                    />
                                                );
                                                }}
                                            </VictoryAnimation>
                                        </svg>
                                    </div>
                                    )
                                }
                                {this.state.showWaste && (
                                    <div className="victory-chart">
                                    <svg viewBox="0 0 400 400" width="100%" height="100%">
                                            <VictoryPie
                                                standalone={false}
                                                animate={{ duration: 1000 }}
                                                width={400} height={400}
                                                data={this.state.wasteData}
                                                innerRadius={120}
                                                cornerRadius={25}
                                                labels={() => null}
                                                style={{
                                                data: { fill: (d) => {
                                                    const color = d.y > 80 ? "green" : "red";
                                                    return d.x === 1 ? color : "transparent";
                                                }
                                                }
                                                }}
                                            />
                                            <VictoryAnimation duration={1000} data={this.state}>
                                                {(newProps) => {
                                                return (
                                                    <VictoryLabel
                                                    textAnchor="middle" verticalAnchor="middle"
                                                    x={200} y={200}
                                                    text={`${Math.round(newProps.wastePercent)}%`}
                                                    style={{ fontSize: 45 }}
                                                    />
                                                );
                                                }}
                                            </VictoryAnimation>
                                        </svg> 
                                    </div>
                                )}
                                {this.state.showConfiguration && (
                                    <div className="victory-chart">
                                    <svg viewBox="0 0 400 400" width="100%" height="100%">
                                            <VictoryPie
                                                standalone={false}
                                                animate={{ duration: 1000 }}
                                                width={400} height={400}
                                                data={this.state.configurationData}
                                                innerRadius={120}
                                                cornerRadius={25}
                                                labels={() => null}
                                                style={{
                                                data: { fill: (d) => {
                                                    const color = d.y > 80 ? "green" : "red";
                                                    return d.x === 1 ? color : "transparent";
                                                }
                                                }
                                                }}
                                            />
                                            <VictoryAnimation duration={1000} data={this.state}>
                                                {(newProps) => {
                                                return (
                                                    <VictoryLabel
                                                    textAnchor="middle" verticalAnchor="middle"
                                                    x={200} y={200}
                                                    text={`${Math.round(newProps.configurationPercent)}%`}
                                                    style={{ fontSize: 45 }}
                                                    />
                                                );
                                                }}
                                            </VictoryAnimation>
                                        </svg> 
                                    </div>
                                )}
                                {this.state.showAll && <Table bordered pagination={{ position: "bottom", pageSize: 3 }} style={{ margin: "auto", minWidth: "60%"  }} dataSource={dataSourceAll} columns={columns} />}
                                {this.state.showSecurity && <Table bordered pagination={{ position: "bottom", pageSize: 3 }} style={{ margin: "auto", minWidth: "60%"  }} dataSource={dataSourceSecurity} columns={columns} />}
                                {this.state.showConfiguration && <Table bordered pagination={{ position: "bottom", pageSize: 3 }} style={{ margin: "auto", minWidth: "60%" }} dataSource={dataSourceConfiguration} columns={columns} />}
                                {this.state.showWaste && <Table bordered pagination={{ position: "bottom", pageSize: 3 }} style={{ margin: "auto", minWidth: "60%"  }} dataSource={dataSourceWaste} columns={columns} />}
                                </div>
                                {
                                    this.props.accounts.length === 0 && this.state.scanComplete && (
                                        <div className="data-missing-dashboard">
                                            No data available. Please enable some accounts to see data in your dashboard.
                                        </div>
                                    )
                                }
                                
                                    </Card.Body>
                                </Card>
                                <div className="dashboard-trends">
                                <div className="dashboard-title">Trends</div>
                                <div className="dashboard-sidebar">
                                <Card>
                                    <Card.Body>
                                        <div className="card-metric-wrapper">
                                            {this.props.accounts.length}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                        Total Accounts
                                        </div>
                                    </Card.Body>
                                </Card>
                                <Card>
                                    <Card.Body>
                                        <div className="card-metric-wrapper">
                                            {this.props.accounts.length}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                        Total Accounts
                                        </div>
                                    </Card.Body>
                                </Card>
                                </div>
                              
                                </div>
                            <div className="dashboard-sidebar">
                                <Card>
                                    <Card.Body>
                                        <div className="card-metric-wrapper">
                                            {this.props.accounts.length}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            New Violations
                                        </div>
                                    </Card.Body>
                                </Card>
                                <Card>
                                    <Card.Body>
                                        <div className="card-metric-wrapper">
                                            {this.props.accounts.length}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                        Fixed Violations
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>

                            <div className="web-rules">
                            <Card>
                                <Card.Header>
                                    <div className="history-chart-header">
                                        <div className="history-chart-header-title">
                                            Violations Over Time
                                        </div>
                                        <div className="history-chart-header-filters">
                                            <Button type="link">Last 3 Days</Button>
                                            <Button type="link">Last 7 Days</Button>
                                            <Button type="link">MTD</Button>
                                            <Button type="link">Last Month</Button>
                                            <Button type="link">Last 3 Months</Button>
                                            <Button type="link">YTD</Button>
                                            <Button type="link">Last Year</Button>
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div style={{ backgroundColor: "white" }}>
                                        <C3Chart data={data} />
                                    </div>
                                </Card.Body>
                            </Card>
                            </div>
                                </div>
                            </div>
                            )}
                        </div>
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