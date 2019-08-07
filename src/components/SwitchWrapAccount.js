import React from 'react';
import { Switch, notification } from 'antd';
import { connect } from 'react-redux';
import { updateAccount } from '../actions';

class SwitchWrapAccount extends React.Component {

    changeSwitch = (newState) => {
 
        if(this.props.user.Group.includes('Administrators'))
        {
            const newAccount = {
                ...this.props.account,
                Enabled: newState
            };
            console.log(newAccount);
            this.props.updateAccount(newAccount, this.props.account.RoleName);
        } 
        else
        {
            notification.error({
                message: 'Access Denied',
                description: 'You are not permitted to take this action.'
            })
        }
    }

    render() {
        return (
            <Switch checked={this.props.checked} onChange={this.changeSwitch} />
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        accounts: state.accounts
    }
}

export default connect(mapStateToProps, { updateAccount })(SwitchWrapAccount);