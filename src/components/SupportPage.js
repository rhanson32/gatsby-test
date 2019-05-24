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
                {
                    this.state.ticketSubmitted && (
                        <div className="add-ticket">
                            <button className="add-button" onClick={this.addTicket}>
                                Create Support Ticket
                            </button>
                            
                            <SupportList items={this.props.tickets} />
                        </div>
                    )
                }
                {
                    !this.state.ticketSubmitted && (
                        <div>
                            <button className="add-button" onClick={this.viewTickets}>
                                View My Tickets
                            </button>
                            <SupportForm onSubmit={this.submit} />
                        </div>
                    )
                }    
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