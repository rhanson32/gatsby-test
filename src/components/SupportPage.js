import React from 'react';
import { connect } from 'react-redux';
import SupportTabs from './SupportTabs';
import { fetchTickets, postTicket, getCurrentUser } from '../actions';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { getExpiration } from '../utils/auth';
import moment from 'moment';
import { message, Drawer, Button, Spin } from 'antd';
import SupportForm from './SupportForm';
import TopMenu from './TopMenu';
import Header from './Header';

class SupportPage extends React.Component {
    state = {
        ticketSubmitted: true,
        showTickets: true,
        visible: false,
        scanComplete: false
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
        if(!this.props.user.email)
        {
            await this.props.getCurrentUser()
            await this.props.fetchTickets();
            this.setState({ scanComplete: true });
        }
        else
        {
            await this.props.fetchTickets();
            this.setState({ scanComplete: true });
        }
        
    }

    showForm = () => {
        this.setState({ 
            showTickets: false,
            visible: true
        })
    }

    showTickets = () => {
        this.setState({ 
            showTickets: true
        })
    }

    onClose = () => {
        this.setState({
            visible: false
        })
    }

    submit = values => {
        // print the form values to the console
        console.log(values)
        this.setState({
            ticketSubmitted: true
        })
        this.props.postTicket(values, this.props.user);
      }

    render() {
        return (
            <div className="support-page">
                <Header />   
                <TopMenu />
                {
                    this.props.tickets && (
                        <div className="support-screen">
                            <div className="support-screen-max">
                            {
                                this.state.scanComplete && (
                                    <div className="support-screen-header">
                                        <h1>Support Center</h1>
                                        <Button onClick={this.showForm} type="primary">Create Case</Button>  
                                    </div>
                                )
                            }
                            {this.props.tickets.length === 0 && !this.state.scanComplete && (
                                <div style={{ display: "flex", height: "100vh", width: "100vw", justifyContent: "center", alignItems: "center" }}>
                                    <Spin tip="Loading..." style={{ margin: "auto", fontSize: "2rem" }} size="large" />
                                </div>
                                )
                            }
                            {(this.props.tickets.length > 0 || this.state.scanComplete) && <SupportTabs scanComplete={this.state.scanComplete} />}
                            </div>
                        </div> 
                    )
                }  
                <Drawer
                    className="support-drawer"
                    title="Create Support Case"
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    >
                    <SupportForm />
                </Drawer>
            </div>
        )
    }  
}

const mapStateToProps = state => {
    return {
        tickets: state.tickets,
        user: state.user
    }
}

export default connect(mapStateToProps, { fetchTickets, postTicket, getCurrentUser } )(SupportPage);