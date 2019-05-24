import React from 'react'
import { connect } from 'react-redux'
import SupportForm from './SupportForm';
import { fetchTickets } from '../actions'

import Header from './Header'

class SupportPage extends React.Component {
    state = {
        ticketSubmitted: false
    }

    componentDidMount() {
        this.props.fetchTickets()
    }

    addTicket = () => {
        this.setState({ 
            ticketSubmitted: false
        })
    }

    submit = values => {
        // print the form values to the console
        console.log(values)
        this.setState({
            ticketSubmitted: true
        })
      }

    render() {
        return (
            <div>
                <Header />
                {
                    this.state.ticketSubmitted && (
                        <div className="add-ticket">
                            <button onClick={this.addTicket}>
                                Submit another ticket
                            </button>
                        </div>
                    )
                }
                {
                    !this.state.ticketSubmitted && (
                        <SupportForm onSubmit={this.submit} />
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

export default connect(mapStateToProps, { fetchTickets } )(SupportPage);