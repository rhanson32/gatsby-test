import React from 'react';
import { connect } from 'react-redux';

import { toggleAddAccount } from '../actions';

class AddAccount extends React.Component {
    state = {
        AccountId: ""
    };

    handleChangeAccount = (event) => {
        console.log(event.target.value);
        this.setState({ AccountId: event.target.value });
    }

    submitAccount = () => {
        this.props.toggleAddAccount();
    }

    cancelAccount = () => {
        this.props.toggleAddAccount();
    }

    render() {
        return (
            <div className="account-item">
                <input value={this.state.AccountId} onChange={this.handleChangeAccount} placeholder="25237483438"></input>
                <select>
                    <option value="AWS">AWS</option>
                </select>
                <input placeholder="arn-example"></input>
                <button onClick={this.submitAccount}>Submit</button>
                <button onClick={this.cancelAccount}>Cancel</button>
            </div>
        )
    }
}

export default connect(null, { toggleAddAccount })(AddAccount);