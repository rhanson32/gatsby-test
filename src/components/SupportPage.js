import React from 'react'
import { connect } from 'react-redux'
import SupportForm from './SupportForm';
import SupportList from './SupportList';
import { fetchTickets, postTicket } from '../actions'

import Header from './Header'

class SupportPage extends React.Component {
    state = {
        ticketSubmitted: true
    }

    componentDidMount() {
        this.props.fetchTickets()
    }

    addTicket = () => {
        this.setState({ 
            ticketSubmitted: false
        })
    }

    viewTickets = () => {
        this.setState({ 
            ticketSubmitted: true
        })
    }

    submit = values => {
        // print the form values to the console
        console.log(values)
        this.setState({
            ticketSubmitted: true
        })
        this.props.postTicket(values);
      }

    render() {
        console.log(this.props)
        return (
            <div>
                <Header />
                <div className="support-screen">
                    <div className="support-headers">
                        <button className={this.state.ticketSubmitted ? "inactive-support-header support-header" : "support-header"} onClick={this.addTicket}>
                            New Request
                        </button>
                        <button className={!this.state.ticketSubmitted ? "inactive-support-header support-header" : "support-header"} onClick={this.viewTickets}>
                            My Requests
                        </button>
                    </div>
                    {this.state.ticketSubmitted && <SupportList items={this.props.tickets} />} 
                    {!this.state.ticketSubmitted && <SupportForm onSubmit={this.submit} />}
                </div>  
            </div>
        )
    }
    
}

const mapStateToProps = state => {
    return {
        tickets: state.tickets
    }
}

export default connect(mapStateToProps, { fetchTickets, postTicket } )(SupportPage);