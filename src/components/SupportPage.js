import React from 'react'
import { connect } from 'react-redux'
import LeftMenu from './LeftMenu';
import SupportTabs from './SupportTabs';
import { fetchTickets, postTicket, getCurrentUser } from '../actions';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { getExpiration } from '../utils/auth';
import moment from 'moment';
import { message } from 'antd';

import Header from './Header'

class SupportPage extends React.Component {
    state = {
        ticketSubmitted: true,
        showTickets: true
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
            showTickets: false
        })
    }

    showTickets = () => {
        this.setState({ 
            showTickets: true
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
                            </div>
                            <SupportTabs />
                        </div> 
                    )
                }  
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