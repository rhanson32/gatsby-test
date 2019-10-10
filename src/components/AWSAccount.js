import React from 'react';
import { connect } from 'react-redux';
import { Input, Button, notification } from 'antd';

import { toggleAddAccount, postAccount, getCurrentUser, updateCustomerStatus, postHistory } from '../actions';

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

    submitAccount = async () => {
        if(this.state.AccountId)
        {
            let response = await this.props.postAccount(this.state, this.props.user.CustomerId);
            this.props.toggleAddAccount();

            console.log(response);

            if(response.statusCode === 200)
            {
                this.props.updateCustomerStatus('Active');
                this.props.postHistory({ Event: 'AddMasterAccount' })
            }
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
                <div className="account-missing-list">
                    <div className="account-item">
                        <div className="account-item-header">
                            Your account currently has no AWS Master account defined. Please enter your AWS master account ID in order to scan your AWS estate.
                        </div>
                        <div className="account-item-field-large">
                            <div>
                                <label>AWS Account ID</label>
                            </div>
                            <div className="account-item-buttons">
                                
                                <Input name="AccountId" value={this.state.AccountId} onChange={this.handleUpdate} placeholder="e.g. 25237483438" />
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

export default connect(mapStateToProps, { toggleAddAccount, postAccount, getCurrentUser, updateCustomerStatus, postHistory })(AddAccount);