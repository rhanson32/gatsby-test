import React from 'react';
import { Switch } from 'antd';
import { connect } from 'react-redux';
import { updateAccount } from '../actions';

class SwitchWrap extends React.Component {

    changeSwitch = (newState) => {
 
        const newAccount = {
            ...this.props.account,
            Enabled: newState
        };
        console.log(newAccount);
        this.updateAccount(newAccount, this.props.account.RoleName);
    }

    updateAccount = (id, user) => {
        // const enabledCount = this.props.rules.filter(rule => rule.Enabled).length;
        
        // if(enabledCount >= 10 && this.props.user.Plan === "Free")
        // {
        //     console.log("Cannot add more rules. Please upgrade to the Standard Plan to enable more rules.");
        //     this.error();
        // }
        // else
        // {
            this.props.updateAccount(id, user); 
       // }
    }

    disableRule = (id) => {
        this.props.updateAccount(id); 
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

export default connect(mapStateToProps, { updateAccount })(SwitchWrap);