import React from 'react'
import { connect } from 'react-redux'
import SupportForm from './SupportForm';
import SupportList from './SupportList';
import { fetchTickets, postTicket, getCurrentUser } from '../actions'

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
        console.log(this.props)
        return (
            <div>
                <Header />
                <div className="support-screen">
                    {this.state.showTickets && <SupportList count={this.props.tickets.length} items={this.props.tickets} />} 
                    {!this.state.showTickets && <SupportForm onSubmit={this.submit} />}
                    <div className="support-headers">
                        <button className={this.state.showTickets ? "inactive-support-header" : "support-header"} onClick={this.showForm}>
                            New Request
                        </button>
                        <button className={this.state.showTickets ? "support-header" : "inactive-support-header" } onClick={this.showTickets}>
                            My Requests
                        </button>
                    </div>
                </div>  
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