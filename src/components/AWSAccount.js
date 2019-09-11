import React from 'react';
import { connect } from 'react-redux';
import { Input, Button, notification } from 'antd';

import { toggleAddAccount, postAccount, getCurrentUser } from '../actions';

class AddAccount extends React.Component {
    state = {
        AccountId: ``,
        Provider: 'AWS'
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
        if(this.state.AccountId)
        {
            this.props.postAccount(this.state, this.props.user.CustomerId);
            this.props.toggleAddAccount();
        }
        else
        {
            notification.error({
                message: 'Account Id Missing',
                description: 'Please enter in an account ID before submitting.'
            })
        }
        
    }

    cancelAccount = () => {
        this.props.toggleAddAccount();
    }

    render() {
        return (
            <div className="settings-card-title">
                <div className="account-list">
                    <div className="account-item">
                        <div className="account-item-field-large">
                            <label>AWS Account ID</label>
                            <Input name="AccountId" value={this.state.AccountId} onChange={this.handleUpdate} placeholder="e.g. 25237483438" />
                        </div>
                        <div className="account-item-buttons">
                            <Button onClick={this.submitAccount} type="primary">Submit</Button>
                        </div>
                    </div>
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