import React from 'react';
import { connect } from 'react-redux';
import 'c3/c3.css';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { isLoggedIn, getExpiration } from '../utils/auth';
import { Modal, Button, message, notification, Alert } from 'antd';
import { Progress } from "tabler-react";
import "tabler-react/dist/Tabler.css";  
import TopMenu from './TopMenu';
import Header from './Header';
import { Link } from '@reach/router';
import Footer from './Footer';
import WelcomeScreen from './WelcomeScreen';
import { getCurrentUser, getRules, getAccounts, getMetrics, fetchUsers, fetchDashboardData, fetchTickets, getSettings, updateCustomerStatus, postAccount, toggleWelcomeScreen } from '../actions';
import RuleListItem from './RuleListItem';
import moment from 'moment';
import DashboardModule from './DashboardModule';
import DashboardOverlay from './DashboardOverlay';

import 'antd/dist/antd.css';
import 'chartist/dist/chartist.min.css';

class Dashboard extends React.Component {
    
    constructor() {
        super();
        this.state = {
            ModalText: 'This account has been cancelled. Visit the Settings page to re-enable this account.',
            visible: false,
            confirmLoading: false,
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
                await this.props.fetchDashboardData(this.props.user.CustomerId);
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
 
            this.setState({ scanComplete: true }); 
        }
        else
        {
            try
            {
                this.setState({ loadingProgress: 25 });
                await this.props.fetchDashboardData(this.props.user.CustomerId);
                this.setState({ loadingProgress: 75 });
            }
            catch(err)
            {
                console.log(err);
            }
            
            this.setState({ scanComplete: true });

            if(this.props.user.Status === "Cancelled")
                this.setState({ visible: true })
        }

        this.setState({ interval: setInterval( async () => {
            this.props.fetchDashboardData(this.props.user.CustomerId);
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
        });
        this.props.toggleWelcomeScreen();
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
          
        return (
            <div className="dashboard-page">
                    <Header />
                    <TopMenu />
                    {!this.state.scanComplete && <DashboardOverlay />}

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
                    {this.props.user && ( 
                        <div className="dashboard-addition">
                            {(this.props.user.Status === 'New' || moment(parseInt(this.props.user.CreateDate)* 1000).isAfter(moment().subtract(7, 'days'))) && !this.props.welcomeScreen && (
                                <div className="alert-wrapper">
                                    <Alert type="info" closable description={<div style={{ width: "100%" }}>Check out our<Button onClick={this.showWelcomeScreen} type="link">Getting Started</Button>guide for tips on how to configure Purify for your AWS accounts.</div>} message="Need help getting started?" banner />
                                </div>
                            )}
                            {this.props.welcomeScreen && <WelcomeScreen />}
                            {!this.state.scanComplete && (
                            <div className="alert-banner">
                                <Alert type="info" description={<Progress>
                                    <Progress.Bar color="green" width={this.state.loadingProgress} />
                                </Progress>} message="Retrieving Latest Data" banner />
                            </div>
                            )}
                            <div className="dashboard-max">
                                <div className="dashboard-top">
                                    {!this.props.welcomeScreen && this.props.metrics && this.props.metrics['last3Days'] && <div className="dashboard-title-short">Dashboard</div>}
                                    {!this.props.welcomeScreen && this.props.user.Status === 'Active' && this.props.metrics && this.props.metrics['last3Days'] && (
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
                                    )}
                                </div>
                                
                                {this.props.user.Status === 'New' && !this.props.welcomeScreen && (
                                    <div className="headlines-empty">
                                        AWS Master account has not been configured. Please &nbsp;<Link to="/app/accounts">add your organization's master account</Link>&nbsp; to continue.
                                    </div>
                                )}
                            
                             {!this.props.welcomeScreen && this.props.user.Status === 'Active' && this.props.metrics && this.props.metrics['last3Days'] && (   
                                <div className="dashboard-trends">
                                    <DashboardModule filter={this.state.showAll ? 'all' : this.state.showSecurity ? 'security' : this.state.showWaste ? 'waste' : 'configuration'} selected={this.state.selectedChart} />
                                </div>
                            )}
                            {!this.props.welcomeScreen && this.props.user && this.props.user.Status === 'Active' && this.props.metrics && this.props.metrics['last3Days']  && (
                                    <div className="dashboard-rule-detail-section">
                                        <div className="dashboard-trends-title">Rule Detail</div>
                                        <div className="rule-list-header">
                                            <div className="rule-list-header-container-wide">
                                                Rule Name
                                            </div>
                                            <div className="rule-list-header-container">
                                                Rule Status
                                            </div>
                                            <div className="rule-list-header-container">
                                                Violation Count
                                            </div>
                                            <div className="rule-list-header-container">
                                                Compliance Status
                                            </div>
                                        </div>
                                        {this.state.showAll && this.props.rules.map((rule, index) => <RuleListItem rule={rule} index={index} />)}
                                        {this.state.showSecurity && this.props.rules.filter(rule => rule.Category === 'Security').map((rule, index) => <RuleListItem rule={rule} index={index} />)}
                                        {this.state.showWaste && this.props.rules.filter(rule => rule.Category === 'Waste').map((rule, index) => <RuleListItem rule={rule} index={index} />)}
                                        {this.state.showConfiguration && this.props.rules.filter(rule => rule.Category === 'Configuration').map((rule, index) => <RuleListItem rule={rule} index={index} />)}
                                    </div>
                                )
                            }
                            
                    </div>
                    </div>
                    )}
                </div>
                
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
        metrics: state.metrics,
        welcomeScreen: state.welcomeScreen
    }
}

export default connect(mapStateToProps, { getCurrentUser, getRules, getAccounts, getMetrics, fetchUsers, fetchDashboardData, fetchTickets, getSettings, updateCustomerStatus, postAccount, toggleWelcomeScreen })(Dashboard);