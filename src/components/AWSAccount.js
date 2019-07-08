import React from 'react';
import { connect } from 'react-redux';
import { Input, Button } from 'antd';

import { toggleAddAccount, postAccount, getCurrentUser } from '../actions';

class AddAccount extends React.Component {
    state = {
        id: ``,
        provider: 'AWS',
        role: ``
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
            <div className="settings-card-title">
                    <div className="account-list">
                        <div className="account-header">
                            <div className="account-item-field-large">
                                Account ID
                            </div>
                            <div className="account-item-field-large">
                                Role Name
                            </div>
                            <div className="account-item-field">
                                &nbsp;  
                            </div>
                        </div>
                        <div className="account-item">
                            <div className="account-item-field-large">
                                <Input name="id" value={this.state.id} onChange={this.handleUpdate} placeholder="e.g. 25237483438" />
                            </div>
                            <div className="account-item-field-large">
                                <Input name="role" value={this.state.role} onChange={this.handleUpdate} placeholder="Role Name" />
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