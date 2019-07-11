import React from 'react'
import { connect } from 'react-redux'
import LeftMenu from './LeftMenu';
import SupportTabs from './SupportTabs';
import { fetchTickets, postTicket, getCurrentUser } from '../actions';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { getExpiration } from '../utils/auth';
import moment from 'moment';
import { message, Drawer, Button } from 'antd';
import SupportForm from './SupportForm';

import Header from './Header'

class SupportPage extends React.Component {
    state = {
        ticketSubmitted: true,
        showTickets: true,
        visible: false
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
        if(!this.props.User.email)
        {
            await this.props.getCurrentUser()
            this.props.fetchTickets()
        }
        else
        {
            this.props.fetchTickets()
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
        this.props.postTicket(values, this.props.User);
      }

    render() {
        return (
            <div className="support-page">
                <Header />
                <LeftMenu />   
                
                {
                    this.props.tickets && (
                        <div className="support-screen">
                            <div className="support-screen-header">
                                <h1>Support Center</h1>
                                <Button onClick={this.showForm} type="primary">Create Case</Button>  
                            </div>
                            <SupportTabs />
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
        User: state.user
    }
}

export default connect(mapStateToProps, { fetchTickets, postTicket, getCurrentUser } )(SupportPage);