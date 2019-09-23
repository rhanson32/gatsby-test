import React from 'react';
import { connect } from 'react-redux';
import 'c3/c3.css';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { isLoggedIn, getExpiration } from '../utils/auth';
import { Spin, Table, Modal, Button, message, notification, Tooltip, Alert } from 'antd';
import { Card, Progress } from "tabler-react";
import "tabler-react/dist/Tabler.css";  
import TopMenu from './TopMenu';
import Header from './Header';
import Footer from './Footer';
import WelcomeScreen from './WelcomeScreen';
import ViolationTable from './ViolationTable';
import { getCurrentUser, getRules, getAccounts, getMetrics, fetchUsers, fetchTickets, getSettings, getHistory, updateCustomerStatus, postAccount } from '../actions';
import Line from './Line';
import Pie from './Pie';
import moment from 'moment';

import 'antd/dist/antd.css';
import 'chartist/dist/chartist.min.css';

class Dashboard extends React.Component {
    
    constructor() {
        super();
        this.state = {
            ModalText: 'This account has been cancelled. Visit the Settings page to re-enable this account.',
            visible: false,
            confirmLoading: false,
            gettingStarted: false,
            account: ``,
            showWelcomeScreen: false,
            showAll: true,
            showSecurity: false,
            showWaste: false,
            showConfiguration: false,
            scanComplete: false,
            error: {
                title: ``,
                message: ``
            },
            interval: 0,
            loadingProgress: 0,
            showDetail: false,
            detailId: ``,
            chartData: {
             },
             selectedChart: 'last12Hours',
             previewScreen: 'download'
          };
    }
    

    componentDidMount = async () => {
        const user = await getCurrentUser();

        this.setState({ 
            gettingStarted: moment(this.props.user.CreateDate).isAfter(moment().subtract(7, 'days')) ? true : false
        });

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
            this.setState({ scanComplete: true });
        }

        if(!this.props.user.email)
        {
            try
            {
                await this.props.getCurrentUser();
                if(this.props.user.Status === "Cancelled")
                {
                    this.setState({ visible: true });
                }
                    
                this.setState({ loadingProgress: 25 });
                const metrics = new Promise((resolve, reject) => this.props.getMetrics(this.props.user.CustomerId) ? resolve : reject);
                const history = this.props.getHistory(this.props.user);
                Promise.all([metrics]).then((values) => {
                    console.log(values);
                })
                await this.props.getRules(this.props.user);
                console.log(metrics);
                this.setState({ loadingProgress: 50 });
               
                this.setState({ loadingProgress: 75 });
                this.setState({ loadingProgress: 100 });
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

            await this.props.getAccounts(this.props.user.CustomerId);
            this.props.fetchUsers(this.props.user.CustomerId); 
            this.props.getSettings(this.props.user.CustomerId); 
            this.setState({ scanComplete: true });
            this.props.fetchTickets();  
        }
        else
        {
            try
            {
                this.props.getMetrics(this.props.user.CustomerId);
                this.setState({ loadingProgress: 25 });
                await this.props.getRules(this.props.user);
                this.setState({ loadingProgress: 75 });
                await this.props.getHistory(this.props.user);
            }
            catch(err)
            {
                console.log(err);
            }
            
            await this.props.getAccounts(this.props.user.CustomerId);
            this.props.fetchUsers(this.props.user.CustomerId);
            this.props.getSettings(this.props.user.CustomerId);
            this.setState({ scanComplete: true });
            this.props.fetchTickets();

            if(this.props.user.Status === "Cancelled")
                this.setState({ visible: true })
        }
        this.setState({ interval: setInterval( async () => {
            await this.props.getRules(this.props.user);
        }, 30000)});
    }

    componentWillUnmount = () => {
        clearInterval(this.state.interval);
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

    showWelcomeScreen = () => {
        this.setState({
            showWelcomeScreen: true
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
        this.setState({
            showWelcomeScreen: false
        })
    }

    handleSubmit = () => {

        if(this.state.previewScreen === 'download')
        {
            this.setState({
                previewScreen: 'deploy'
            });
        }
        else if(this.state.previewScreen === 'deploy')
        {
            this.setState({
                previewScreen: 'enter'
            });
        }
        else if(this.state.previewScreen === 'enter')
        {
            this.setState({
                previewScreen: 'download'
            });
        }
    }

    render() {
        if (!isLoggedIn()) 
        {
            navigate('/app/login');
        }
        const { visible, confirmLoading, ModalText } = this.state;

        const dataSourceAll = this.props.rules.map((rule, index) => {
            return {
                key: index.toString(),
                name: rule.Name,
                category: rule.Category,
                id: rule.RuleId,
                status:  rule.Violations.filter(violation => violation.Status === 'Active').length === 0 ? "Compliant": "Non-Compliant",
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
                status:  rule.Violations.filter(violation => violation.Status === 'Active').length === 0 ? "Compliant": "Non-Compliant",
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
                status:  rule.Violations.filter(violation => violation.Status === 'Active').length === 0 ? "Compliant": "Non-Compliant",
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
                status:  rule.Violations.filter(violation => violation.Status === 'Active').length === 0 ? "Compliant": "Non-Compliant",
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
                        {record.violations.filter(violation => !violation.Status || (violation.Status && violation.Status === 'Active')).length}
                    </span>
                    )
                },
                key: 'violations',
                sorter: (a, b) => a.violations.length - b.violations.length,
                sortDirections: ['descend', 'ascend']
            },
            {
                title: 'Actions',
                render: (text, record) => {
                    return (
                    <span>
                        {record.violations.length > 0 && <Button name={record.name} id={record.id} type="link" onClick={this.showDetail}>View</Button>}
                    </span>
                    )
                },
                key: 'actions',
                sorter: (a, b) => a.violations - b.violations,
            }
          ];

        return (
            <div className="dashboard-page">
                    <Header />
                    <TopMenu />
                    {this.props.user.Status !== 'New' && this.state.gettingStarted && (
                        <div className="alert-wrapper">
                            <Alert type="info" closable description={<div style={{ width: "100%" }}>Check out our<Button onClick={this.showWelcomeScreen} type="link">Getting Started</Button>guide for tips on how to configure Purify for your AWS accounts.</div>} message="Need help getting started?" banner />
                        </div>
                    )}
                    {this.state.showWelcomeScreen && <WelcomeScreen />}
                    {this.props.user.Status === 'New' && <WelcomeScreen />}

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
                {this.props.user && this.props.user.Status && this.props.user.Status !== 'New' && ( 
                    <div className="dashboard">
                            {!this.state.scanComplete && (
                            <div className="alert-banner">
                                <Alert type="info" description={<Progress>
                                    <Progress.Bar color="green" width={this.state.loadingProgress} />
                                </Progress>} message="Retrieving Latest Data" banner />
                            </div>
                            )}
                            <div className="dashboard-max">
                                {!this.state.showWelcomeScreen && (
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
                                )}
                                {this.props.accounts.length === 0 && !this.state.showWelcomeScreen && this.state.scanComplete && (
                                    <div className="headlines-empty">
                                        No accounts currently enabled. Please enable accounts to see statistics about your accounts.
                                    </div>
                                )}
                                {this.props.accounts.length !== 0 && !this.state.showWelcomeScreen && (
                                <div className="dashboard-headlines">
                                    <div className="dashboard-score">
                                        <Card>
                                            <Card.Body>
                                                <div className="headline-score-header">
                                                    {this.state.scanComplete && this.state.showAll && "Purify Score"}
                                                    {this.state.scanComplete && this.state.showSecurity && "Security Score"}
                                                    {this.state.scanComplete && this.state.showWaste && "Waste Score"}
                                                    {this.state.scanComplete && this.state.showConfiguration && "Configuration Score"}
                                                </div>
                                                <div className="headline-score-data">
                                                    {this.state.scanComplete && this.state.showAll && this.props.metrics.PurifyScore}
                                                    {this.state.scanComplete && this.state.showSecurity && this.props.metrics.SecurityScore}
                                                    {this.state.scanComplete && this.state.showWaste && this.props.metrics.WasteScore}
                                                    {this.state.scanComplete && this.state.showConfiguration && this.props.metrics.ConfigurationScore}
                                                    {!this.state.scanComplete && <Spin style={{ fontSize: "32px" }} />}
                                                    {!this.state.scanComplete && ' '}
                                                </div>
                                                <Progress>
                                                    {this.state.scanComplete && this.state.showAll && <Progress.Bar color="green" width={this.props.metrics.PurifyScore} />}
                                                    {this.state.scanComplete && this.state.showSecurity && <Progress.Bar color="green" width={this.props.metrics.SecurityScore} />}
                                                    {this.state.scanComplete && this.state.showWaste && <Progress.Bar color="green" width={this.props.metrics.WasteScore} />}
                                                    {this.state.scanComplete && this.state.showConfiguration && <Progress.Bar color="green" width={this.props.metrics.ConfigurationScore} />}
                                                </Progress>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                    <div className="card-wrapper">
                                        <Card>
                                            <Card.Body>
                                                <div className="card-metric-wrapper">

                                                    <div className="headline-score-data">
                                                        {this.state.scanComplete && this.state.showAll && this.props.metrics.Security && this.props.metrics.Waste && this.props.metrics.Configuration ? this.props.metrics.Security.Violations + this.props.metrics.Configuration.Violations + this.props.metrics.Waste.Violations : <Spin style={{ fontSize: "48px" }} />}
                                                        {this.state.scanComplete && this.state.showSecurity && this.props.metrics.Security && this.props.metrics.Security.Violations}
                                                        {this.state.scanComplete && this.state.showWaste && this.props.metrics.Waste && this.props.metrics.Waste.Violations}
                                                        {this.state.scanComplete && this.state.showConfiguration && this.props.metrics.Configuration && this.props.metrics.Configuration.Violations}
                                                    </div>     
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    Violations
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                    <div className="card-wrapper">
                                        <Card>
                                            <Card.Body>
                                                <div className="card-metric-wrapper">
                                                    <div className="headline-score-data">
                                                        {this.state.scanComplete && this.state.showAll && this.props.metrics.Security && this.props.metrics.Waste && this.props.metrics.Configuration && (this.props.metrics.Security.Evaluations + this.props.metrics.Configuration.Evaluations + this.props.metrics.Waste.Evaluations)}
                                                        {this.state.scanComplete && this.state.showSecurity && this.props.metrics.Security && this.props.metrics.Security.Evaluations}
                                                        {this.state.scanComplete && this.state.showWaste && this.props.metrics.Waste && this.props.metrics.Waste.Evaluations}
                                                        {this.state.scanComplete && this.state.showConfiguration && this.props.metrics.Configuration && this.props.metrics.Configuration.Evaluations}
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <Tooltip placement="bottom" title="Resources scanned per rule multiplied by number of active rules">
                                                        <span>Evaluations</span>
                                                    </Tooltip>
                                                    
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                <div className="card-wrapper">
                                    <Card>
                                        <Card.Body>
                                            <div className="card-metric-wrapper">
                                                <div className="headline-score-data">
                                                    {!this.state.scanComplete && <Spin style={{fontSize: "48px" }} />}
                                                    {this.state.showAll && this.state.scanComplete && this.props.rules.filter(rule => rule.Enabled).length}
                                                    {this.state.showSecurity && this.state.scanComplete && this.props.rules.filter(rule => rule.Enabled && rule.Category === 'Security').length}
                                                    {this.state.showWaste && this.state.scanComplete && this.props.rules.filter(rule => rule.Enabled && rule.Category === 'Waste').length}
                                                    {this.state.showConfiguration && this.state.scanComplete && this.props.rules.filter(rule => rule.Enabled && rule.Category === 'Configuration').length}
                                                    {this.state.scanComplete && " / "}
                                                    {this.state.showAll && this.state.scanComplete && this.props.rules.length}
                                                    {this.state.showSecurity && this.state.scanComplete && this.props.rules.filter(rule => rule.Category === 'Security').length}
                                                    {this.state.showWaste && this.state.scanComplete && this.props.rules.filter(rule => rule.Category === 'Waste').length}
                                                    {this.state.showConfiguration && this.state.scanComplete && this.props.rules.filter(rule => rule.Category === 'Configuration').length}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                Rules Enabled
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div> 
                                         
                            <div className="card-wrapper">
                                    <Card>
                                        <Card.Body>
                                            <div className="card-metric-wrapper">
                                                <div className="headline-score-data">
                                                    {!this.state.scanComplete && <Spin style={{fontSize: "48px" }} />}
                                                    {this.state.scanComplete && this.props.accounts.filter(account => account.Enabled).length}
                                                    {this.state.scanComplete && " / "}
                                                    {this.state.scanComplete && this.props.accounts.length}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                Accounts Enabled
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                            )}
                            {!this.state.showWelcomeScreen && (
                            <div className="dashboard-metrics">
                                <div className="dashboard-title">Category Metrics</div>
                                    <div className="web-metrics">
                                    {!this.state.showDetail && (
                                    <Card>
                                        <Card.Header>
                                            <div className="dashboard-card-header">
                                                {this.state.showAll && "All Categories"}
                                                {this.state.showSecurity && "Security"}
                                                {this.state.showWaste && "Waste"}
                                                {this.state.showConfiguration && "Configuration"}
                                            </div>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="progress-items">
                                                {this.props.user.Status !== 'New' && !this.state.scanComplete && <Spin tip="Loading..." style={{ width: "250px", fontSize: "15px" }} />}
                                                {this.props.user.Status !== 'New' && this.state.showAll && this.state.scanComplete && this.props.accounts.length !== 0 && <Table bordered pagination={{ position: "bottom", pageSize: 4 }} style={{ margin: "auto", width: "90%" }} dataSource={dataSourceAll} columns={columns} />}
                                                {this.props.user.Status !== 'New' && this.state.showSecurity && this.state.scanComplete && this.props.accounts.length !== 0 && <Table bordered pagination={{ position: "bottom", pageSize: 4 }} style={{ margin: "auto", width: "90%"  }} dataSource={dataSourceSecurity} columns={columns} />}
                                                {this.props.user.Status !== 'New' && this.state.showConfiguration && this.state.scanComplete && this.props.accounts.length !== 0 && <Table bordered pagination={{ position: "bottom", pageSize: 4 }} style={{ margin: "auto", width: "90%" }} dataSource={dataSourceConfiguration} columns={columns} />}
                                                {this.props.user.Status !== 'New' && this.state.showWaste && this.state.scanComplete && this.props.accounts.length !== 0 && <Table bordered pagination={{ position: "bottom", pageSize: 4 }} style={{ margin: "auto", width: "90%"  }} dataSource={dataSourceWaste} columns={columns} />}
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
                                        <div>
                                            Violations By Account
                                        </div>
                                        {this.state.scanComplete && <Pie />}
                                    </div>
                                </div>
                            )}
                             {!this.state.showWelcomeScreen && (   
                             <div className="dashboard-trends">
                                    <div className="dashboard-trends-header">
                                        <div className="dashboard-trends-title">Trends</div>
                                        <div className="history-chart-header-filters">
                                           <div className={this.state.selectedChart === 'last12Hours' ? 'selectedLink' : null}> <Button onClick={this.last12Hours} type="link">Last 12 Hours</Button></div>
                                           <div className={this.state.selectedChart === 'last3Days' ? 'selectedLink' : null}> <Button onClick={this.last3Days} type="link">Last 3 Days</Button></div>
                                           <div className={this.state.selectedChart === 'last7Days' ? 'selectedLink' : null}>  <Button onClick={this.last7Days} type="link">Last 7 Days</Button></div>
                                           <div className={this.state.selectedChart === 'lastMonth' ? 'selectedLink' : null}>  <Button onClick={this.lastMonth}  type="link">Last Month</Button></div>
                                           <div className={this.state.selectedChart === 'last3Months' ? 'selectedLink' : null}>  <Button onClick={this.last3Months} type="link">Last 3 Months</Button></div>
                                        </div>
                                    </div>
                                
                                <div className="dashboard-trends-container">
                                    <div className="dashboard-sidebar-2">
                                        <div className="trend-card-wrapper">
                                        <Card>
                                            <Card.Body>
                                                <div className="card-metric-wrapper">
                                                    {!this.state.scanComplete && <Spin style={{ fontSize: "48px" }} />}
                                                    {this.state.scanComplete && this.props.history.filter(item => item.Event === 'FoundViolation' && moment(item.EventTime).isSame(moment().subtract(1, 'days'), 'day')).length}
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
                                                    {this.state.scanComplete && this.props.history.filter(item => item.Event === 'FixedViolation' && moment(item.EventTime).isSame(moment().subtract(1, 'days'), 'day')).length}
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
                                                Violations Over Time (All times UTC)
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="metrics-graph" style={{ backgroundColor: "white", minHeight: "300px" }}>
                                            {this.props.metrics && this.props.metrics['last3Days'] && <Line selected={this.state.selectedChart} />}
                                            {
                                                this.props.metrics && this.props.metrics['last3Days'] && (
                                                    <div className="legend">
                                                        <div className="legend-one"></div><div>Violations Discovered</div>
                                                        <div className="legend-two"></div><div>Violations Resolved</div>
                                                    </div>
                                                )
                                            }
                                            {this.props.metrics && !this.props.metrics['last3Days'] && <div className="metrics-graph-missing">No data available.</div>}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </div>
                             )}
                </div>
                </div>
                )}
                {this.state.scanComplete && <Footer />}
            </div>
        )
    } 
}

const mapStateToProps = state => {
    return {
        user: state.user,
        rules: state.rules,
        accounts: state.accounts,
        history: state.history,
        metrics: state.metrics
    }
}

export default connect(mapStateToProps, { getCurrentUser, getRules, getAccounts, getMetrics, getHistory, fetchUsers, fetchTickets, getSettings, updateCustomerStatus, postAccount })(Dashboard);