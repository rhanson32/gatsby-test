import React from 'react';
import { Switch, notification } from 'antd';
import { connect } from 'react-redux';
import { updateAccount } from '../actions';

class SwitchWrapAccount extends React.Component {

    changeSwitch = (newState) => {
 
        if(this.props.user.Group.includes('Administrators'))
        {
            if(this.props.accounts.filter(account => account.Enabled).length < 3 || this.props.user.Plan === 'Standard')
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
                    message: 'Maximum Accounts Enabled',
                    description: 'Please upgrade to the Standard plan in order to enable more accounts.'
                });
            }
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