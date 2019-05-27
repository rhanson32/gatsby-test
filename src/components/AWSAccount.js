import React from 'react';
import { connect } from 'react-redux';

import { toggleAddAccount, postAccount, getCurrentUser } from '../actions';

class AddAccount extends React.Component {
    state = {
        id: '',
        provider: 'AWS',
        role: ''
    };

    componentDidMount() {
        this.props.getCurrentUser();
    }

    handleChangeAccount = (event) => {
        console.log(event.target.value);
        this.setState({ AccountId: event.target.value });
    }

    handleUpdate = (event) => {
        this.setState({
          [event.target.name]: event.target.value,
        })
      }

    submitAccount = () => {
        if(this.state.id && this.state.role)
        {
            this.props.postAccount(this.state, this.props.user.CustomerId);
            this.props.toggleAddAccount();
        }
        
    }

    cancelAccount = () => {
        this.props.toggleAddAccount();
    }

    render() {
        console.log(this.state);
        return (
            <div className="account-item">
                <div className="account-item-field">
                    <input name="id" value={this.state.AccountId} onChange={this.handleUpdate} placeholder="25237483438"></input>
                </div>
                <div className="account-item-field">
                    <input name="role" onChange={this.handleUpdate} placeholder="Role ARN"></input>
                </div>
                <div className="account-item-buttons">
                    <button className="add-button large-button" onClick={this.submitAccount}>Submit</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { toggleAddAccount, postAccount, getCurrentUser })(AddAccount);