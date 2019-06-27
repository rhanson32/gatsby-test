import React from 'react'
import { connect } from 'react-redux'
import SupportForm from './SupportForm';
import LeftMenu from './LeftMenu';
import SupportList from './SupportList';
import SupportTabs from './SupportTabs';
import { fetchTickets, postTicket, getCurrentUser } from '../actions';
import { IoIosAdd } from 'react-icons/io';

import Header from './Header'

class SupportPage extends React.Component {
    state = {
        ticketSubmitted: true,
        showTickets: true
    }

    componentDidMount = async () => {
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