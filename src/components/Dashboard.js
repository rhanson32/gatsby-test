import React from 'react';
import { connect } from 'react-redux';
import BarChart from './BarChart';
import 'c3/c3.css';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { isLoggedIn, getExpiration } from '../utils/auth';
import { Spin, Table, Modal, Input, Button, message, notification } from 'antd';
import { Card, Progress } from "tabler-react";
import "tabler-react/dist/Tabler.css";  
import TopMenu from './TopMenu';
import Header from './Header';
import ViolationTable from './ViolationTable';
import { getCurrentUser, getRules, getAccounts, fetchUsers, getHistory, updateCustomerStatus, postAccount } from '../actions';
import { VictoryPie, VictoryLabel, VictoryAnimation } from 'victory';
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
            securityViolations: 0,
            configurationViolations: 0,
            wasteViolations: 0,
            securityEvaluations: 0,
            configurationEvaluations: 0,
            wasteEvaluations: 0,
            showDetail: false,
            detailId: ``,
            last3days: true,
            last7days: false,
            lastMonth: false,
            chartData: {
             }
          };
    }
    

    componentDidMount = async () => {
        const user = await getCurrentUser();
        if(moment(getExpiration()) < moment())
        {
            console.log("User session has expired");
            message.warning('Your session has expired. Redirecting to login page in 2 seconds.');
            if(user.type !== 'federated')
            {
                setTimeout(async () => {
                    await Auth.signOut();
                    navigate('/app/login');
                }, 2000); 
            }
            else
            {
                setTimeout(async () => {
                    navigate('/app/login');
                }, 2000); 
            }
            
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
                await this.props.getHistory(this.props.user);
                this.last3Days();
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

            this.setState({ scanComplete: true });
            this.props.getAccounts(this.props.user.CustomerId);
            this.props.fetchUsers(this.props.user.CustomerId);

            if(this.props.user.Status === "Cancelled")
            {
                this.setState({ visible: true });
            }
                
            if(this.props.user.Status === "New")
            {
                this.setState({ welcomeScreen: true });
            }
                
        }
        else
        {
            try
            {
                await this.props.getRules(this.props.user);
                await this.props.getHistory(this.props.user);
                this.last3Days();
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
            this.setState({ scanComplete: true });
            await this.props.getAccounts(this.props.user.CustomerId);
           
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

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    submitAccount = () => {
        
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

    last3Days = () => {
        const foundData = [
            this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(moment().subtract(3, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(moment().subtract(2, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(moment().subtract(1, 'days'), 'day')).length
        ];

        const fixedData = [
            this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(moment().subtract(3, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(moment().subtract(2, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(moment().subtract(1, 'days'), 'day')).length
        ];

        this.setState({
            chartData: {
                'x': [
                    moment().subtract(3, 'days').date(),
                    moment().subtract(2, 'days').date(),
                    moment().subtract(1, 'days').date()
                ],
                'Found Violations': foundData,
                'Fixed Violations': fixedData
            }
        });
    }

    last7Days = () => {
        const foundData = [
            this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(moment().subtract(7, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(moment().subtract(6, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(moment().subtract(5, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(moment().subtract(4, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(moment().subtract(3, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(moment().subtract(2, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(moment().subtract(1, 'days'), 'day')).length
        ];

        const fixedData = [
            this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(moment().subtract(7, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(moment().subtract(6, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(moment().subtract(5, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(moment().subtract(4, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(moment().subtract(3, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(moment().subtract(2, 'days'), 'day')).length,
            this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(moment().subtract(1, 'days'), 'day')).length
        ];

        this.setState({
            chartData: {
                'x': [
                    moment().subtract(7, 'days').date(),
                    moment().subtract(6, 'days').date(),
                    moment().subtract(5, 'days').date(),
                    moment().subtract(4, 'days').date(),
                    moment().subtract(3, 'days').date(),
                    moment().subtract(2, 'days').date(),
                    moment().subtract(1, 'days').date()
                ],
                'Found Violations': foundData,
                'Fixed Violations': fixedData
            },
            chartAxis: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d'
                    }
                }
        });
    }

    lastMonth = () => {
        const currentMonth = moment().month();
        let numDays = moment().subtract(1, 'months').daysInMonth();

        let startDate = moment().set({'year': currentMonth === 0 ? moment().year() - 1 : moment().year(), 'month': currentMonth - 1, 'date': 1, 'hour': 0, 'minute': 0, 'second': 0 });

        let foundData = []; 
        let fixedData = [];
        let labels = [];

        for(let i = 0; i < numDays; i++)
        {
            startDate.add(1, 'days');
            labels.push(i + 1);
            foundData.push(this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(startDate, 'day')).length);
            fixedData.push(this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(startDate, 'day')).length);
        }

        this.setState({
            chartData: {
                'x': labels,
                'Found Violations': foundData,
                'Fixed Violations': fixedData
            }
        });
    }

    monthToDate = () => {
        let foundData = []; 
        let fixedData = [];
        let labels = [];

        const currentDayOfMonth = moment().date();
        let startDate = moment().set({'year': moment().year(), 'month': moment().month(), 'date': 1, 'hour': 0, 'minute': 0, 'second': 0 });

        for(let i = 0; i < currentDayOfMonth; i++)
        {
            startDate.add(1, 'days');
            labels.push(i + 1);
            foundData.push(this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(startDate, 'day')).length);
            fixedData.push(this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(startDate, 'day')).length);
        }

        this.setState({
            chartData: {
                'x': labels,
                'Found Violations': foundData,
                'Fixed Violations': fixedData
            }
        });
    }

    yearToDate = () => {
        let foundData = []; 
        let fixedData = [];
        let labels = [];
        const currentDayOfYear = moment().dayOfYear();
        let startDate = moment().set({'year': moment().year(), 'month': 0, 'date': 1, 'hour': 0, 'minute': 0, 'second': 0 });

        for(let i = 0; i < currentDayOfYear; i++)
        {
            startDate.add(1, 'days');
            labels.push(i + 1);
            foundData.push(this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(startDate, 'day')).length);
            fixedData.push(this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(startDate, 'day')).length);
        }

        this.setState({
            chartData: {
                'x': labels,
                'Found Violations': foundData,
                'Fixed Violations': fixedData
            }
        });
    }

    showDetail = (e) => {
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
        const item = {
            id: this.state.accountId,
            provider: 'AWS'
        };
        this.props.postAccount(item, this.props.user.CustomerId);
        this.setState({
            welcomeScreen: false
        });
    }

    render() {
        if (!isLoggedIn()) 
        {
            navigate('/app/login');
        }
        const { visible, confirmLoading, ModalText, welcomeScreen } = this.state;

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

        return (
            <div className="dashboard-page">
                    <Header />
                    <TopMenu />
                <Modal
                    title="Welcome to Purify!"
                    visible={welcomeScreen}
                    onOk={this.handleSubmit}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleDismiss}
                    cancelText="Dismiss"
                >
                    <div className="new-account-modal">
                        <p>In order to get started quickly, please input the Account Id for your AWS master account below.</p>
                        <div className="new-account-modal-input">
                            <label>Account Id</label>
                            <Input name="accountId" value={this.state.accountId} onChange={this.handleChange} />
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
                            <div className="dashboard-max">
                                <div className="dashboard-top">
                                <div className="dashboard-title-short">Headline</div>
                                <div className="dashboard-filters">
                                    <div style={{ paddingRight: "1rem" }}>Filters: </div>
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
                                </div>
                                <div className="dashboard-headlines">
                                <div className="dashboard-score">
                                <Card>
                                    <Card.Body>
                                        <div style={{ fontSize: "20px", fontWeight: "bold", display: "flex", justifyContent: "center" }}>
                                            Purify Score
                                        </div>
                                        <div style={{ fontSize: "32px", fontWeight: "bold", display: "flex", justifyContent: "center", padding: "0.5rem 0" }}>
                                            {this.state.scanComplete && this.state.percent}
                                            {!this.state.scanComplete && <Spin style={{ fontSize: "32px" }} />}
                                        </div>
                                        <Progress>
                                            {this.state.scanComplete && <Progress.Bar color="green" width={this.state.percent} />}
                                        </Progress>
                                    </Card.Body>
                                </Card>
                                </div>
                                
                                <div className="card-wrapper">
                                <Card>
                                <Card.Body>
                                    <div className="card-metric-wrapper">
                                        {!this.state.scanComplete && <Spin style={{fontSize: "48px" }} />}
                                        {this.state.showAll && this.state.scanComplete && this.props.rules.filter(rule => rule.Enabled).length}
                                        {this.state.showSecurity && this.state.scanComplete && this.props.rules.filter(rule => rule.Enabled && rule.Category === 'Security').length}
                                        {this.state.showWaste && this.state.scanComplete && this.props.rules.filter(rule => rule.Enabled && rule.Category === 'Waste').length}
                                        {this.state.showConfiguration && this.state.scanComplete && this.props.rules.filter(rule => rule.Enabled && rule.Category === 'Configuration').length}
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
                                        {!this.state.scanComplete && <Spin style={{fontSize: "48px" }} />}
                                        {this.state.showAll && this.state.scanComplete && this.props.rules.length}
                                        {this.state.showSecurity && this.state.scanComplete && this.props.rules.filter(rule => rule.Category === 'Security').length}
                                        {this.state.showWaste && this.state.scanComplete && this.props.rules.filter(rule => rule.Category === 'Waste').length}
                                        {this.state.showConfiguration && this.state.scanComplete && this.props.rules.filter(rule => rule.Category === 'Configuration').length}
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
                                                {!this.state.scanComplete && <Spin style={{fontSize: "48px" }} />}
                                                {this.state.scanComplete && this.props.accounts.filter(account => account.Enabled).length}
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
                                            {!this.state.scanComplete && <Spin style={{fontSize: "48px" }} />}
                                            {this.state.scanComplete && this.props.accounts.length}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            Total Accounts
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                            </div>
                            <div className="dashboard-metrics">
                            <div className="dashboard-title">Category Metrics</div>
                                <div className="web-metrics">
                                {!this.state.showDetail && (
                                <Card>
                                    <Card.Header>
                                        <div className="dashboard-card-header">
                                            <div>
                                                {this.state.showAll && "All Categories"}
                                                {this.state.showSecurity && "Security"}
                                                {this.state.showWaste && "Waste"}
                                                {this.state.showConfiguration && "Configuration"}
                                            </div> 
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                    <div className="progress-items">
                                    {!this.state.scanComplete && <Spin tip="Loading..." style={{ width: "250px", fontSize: "15px" }} />}
                                    {this.state.showAll && this.state.scanComplete && (
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
                                {!this.state.scanComplete && <Spin tip="Loading..." style={{ width: "60%" }} />}
                                {this.state.showAll && this.state.scanComplete && <Table bordered pagination={{ position: "bottom", pageSize: 3 }} style={{ margin: "auto", minWidth: "60%"  }} dataSource={dataSourceAll} columns={columns} />}
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
                                </Card>)
                                }
                                {
                                    this.state.showDetail && (
                                        <Card>
                                            <Card.Header>
                                                <div>Violation Detail</div>
                                                <div><Button onClick={this.hideDetail} type="link">Close</Button></div>
                                            </Card.Header>
                                            <Card.Body>
                                                <ViolationTable id={this.state.detailId} rule={this.props.rules.find(rule => rule.RuleId === this.state.detailId)} />
                                            </Card.Body>
                                        </Card>
                                    )
                                }
                                </div>
                                <div className="dashboard-sidebar">
                                <div className="metric-card-wrapper">
                                <Card>
                                    <Card.Body>
                                        <div className="card-metric-wrapper">
                                            {this.state.showAll && (
                                                <div>
                                                    {this.state.scanComplete ? this.state.securityViolations + this.state.configurationViolations + this.state.wasteViolations : <Spin style={{ fontSize: "48px" }} />}
                                                </div>
                                            )}
                                            {this.state.showSecurity && (
                                                <div>
                                                    {this.state.scanComplete ? this.state.securityViolations : <Spin style={{ fontSize: "48px" }} />}
                                                </div>
                                            )}
                                            {this.state.showWaste && <div>{this.state.scanComplete ? this.state.wasteViolations : <Spin style={{ fontSize: "48px" }} />}</div>}
                                            {this.state.showConfiguration && (
                                                <div>
                                                    {this.state.scanComplete ? this.state.configurationViolations : <Spin style={{ fontSize: "48px" }} />}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            Violations
                                        </div>
                                    </Card.Body>
                                </Card>
                                </div>
                                <div className="metric-card-wrapper">
                                <Card>
                                    <Card.Body>
                                        <div className="card-metric-wrapper">
                                            {this.state.showAll && (
                                                <div>
                                                    {this.state.scanComplete ? this.state.securityEvaluations + this.state.configurationEvaluations + this.state.wasteEvaluations : <Spin style={{ fontSize: "48px" }} />}
                                                </div>
                                            )}
                                            {this.state.showSecurity && (
                                                <div>
                                                    {this.state.scanComplete ? this.state.securityEvaluations : <Spin style={{ fontSize: "48px" }} />}
                                                </div>
                                            )}
                                            {this.state.showWaste && (
                                                <div>
                                                    {this.state.scanComplete ? this.state.wasteEvaluations : <Spin style={{ fontSize: "48px" }} />}
                                                </div>
                                            )}
                                            {this.state.showConfiguration && (
                                                <div>
                                                    {this.state.scanComplete ? this.state.configurationEvaluations : <Spin style={{ fontSize: "48px" }} />}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            Evaluations
                                        </div>
                                    </Card.Body>
                                </Card>
                                </div>
                                <div className="metric-card-wrapper">
                                <Card>
                                    <Card.Body>
                                        <div className="card-metric-wrapper">
                                            {this.state.showAll && (
                                                <div>
                                                    {this.state.scanComplete ? this.state.securityEvaluations === 0 || this.state.configurationEvaluations === 0 || this.state.wasteEvaluations === 0 ? 'Unavailable' : Math.round((this.state.securityViolations + this.state.configurationViolations + this.state.wasteViolations) / (this.state.securityEvaluations + this.state.configurationEvaluations + this.state.wasteEvaluations)* 100) : <Spin style={{ fontSize: "48px" }} />}
                                                </div>
                                            )}
                                            {this.state.showSecurity && this.state.scanComplete && (
                                                <div>
                                                    {Math.round((this.state.securityViolations / this.state.securityEvaluations) * 100)}
                                                </div>
                                            )}
                                            {this.state.showWaste && this.state.scanComplete && (
                                                <div>
                                                    {Math.round((this.state.wasteViolations / this.state.wasteEvaluations) * 100)}
                                                </div>
                                            )}
                                            {this.state.showConfiguration && this.state.scanComplete && (
                                                <div>
                                                    {this.state.configurationViolations === 0 ? 'Unavailable' : Math.round((this.state.configurationViolations / this.state.configurationEvaluations) * 100)}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                        Violation %
                                        </div>
                                    </Card.Body>
                                </Card>
                                </div>
                                </div>
                                </div>
                                <div className="dashboard-trends">
                                    <div className="dashboard-trends-header">
                                        <div className="dashboard-trends-title">Trends</div>
                                        <div className="history-chart-header-filters">
                                            <Button onClick={this.last3Days} type="link">Last 3 Days</Button>
                                            <Button onClick={this.last7Days} type="link">Last 7 Days</Button>
                                            <Button onClick={this.monthToDate} type="link">MTD</Button>
                                            <Button onClick={this.lastMonth}  type="link">Last Month</Button>
                                            <Button type="link">Last 3 Months</Button>
                                            <Button onClick={this.yearToDate} type="link">YTD</Button>
                                            <Button type="link">Last Year</Button>
                                        </div>
                                    </div>
                                
                                <div className="dashboard-trends-container">
                            <div className="dashboard-sidebar-2">
                                <div className="trend-card-wrapper">
                                <Card>
                                    <Card.Body>
                                        <div className="card-metric-wrapper">
                                            {!this.state.scanComplete && <Spin style={{ fontSize: "48px" }} />}
                                            {this.state.scanComplete && this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.ActionDate).isSame(moment().subtract(1, 'days'), 'day')).length}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            New Violations
                                        </div>
                                    </Card.Body>
                                </Card>
                                </div>
                                <div className="trend-card-wrapper">
                                <Card>
                                    <Card.Body>
                                        <div className="card-metric-wrapper">
                                            {!this.state.scanComplete && <Spin style={{ fontSize: "48px" }} />}
                                            {this.state.scanComplete && this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.ActionDate).isSame(moment().subtract(1, 'days'), 'day')).length}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                        Fixed Violations
                                        </div>
                                    </Card.Body>
                                </Card>
                                </div>
                            </div>

                            <div className="dashboard-trends-graph">
                                <Card>
                                    <Card.Header>
                                        <div className="history-chart-header">
                                            <div className="history-chart-header-title">
                                                Violations Over Time
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <div style={{ backgroundColor: "white" }}>
                                            <BarChart data={this.state.chartData} axis={this.state.chartAxis} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                            </div>
                            </div>
                                </div>
                        </div>
            </div>
        )
    } 
}

const mapStateToProps = state => {
    return {
        user: state.user,
        rules: state.rules,
        accounts: state.accounts,
        history: state.history
    }
}

export default connect(mapStateToProps, { getCurrentUser, getRules, getAccounts, getHistory, fetchUsers, updateCustomerStatus, postAccount })(Dashboard);