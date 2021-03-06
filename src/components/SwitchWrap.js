import React from 'react';
import { Link } from 'gatsby';
import { Switch, notification, message } from 'antd';
import { connect } from 'react-redux';
import { enableRule, disableRule } from '../actions';

class SwitchWrap extends React.Component {
    state = {
        id: this.props.id
    }

    changeSwitch = (newState) => {
 
        const { id, user } = this.props;
        if(newState)
        {
            this.enableRule(id, user);
        }
        else
        {
            this.disableRule(id, user);
        }
    }

    error = () => {
        const RulesMessage = () => (
            <div>
                Free plan users may only enable 10 rules at one time. Please <Link to="/app/payment">upgrade</Link> to the Standard plan to remove the cap on rules.
            </div>
        )
        message.error(<RulesMessage />, 5);
    };

    enableRule = (id, user) => {
        const enabledCount = this.props.rules.filter(rule => rule.Enabled).length;
        
        if(enabledCount >= 10 && this.props.user.Plan === "Free")
        {
            console.log("Cannot add more rules. Please upgrade to the Standard Plan to enable more rules.");
            this.error();
        }
        else if(!this.props.user.Group.includes('Administrators'))
        {
            notification.error({
                message: 'Access Denied',
                description: 'You are not permitted to take this action.'
            })
        }
        else
        {
            this.props.enableRule(id, user); 
        }
    }

    disableRule = (id, user) => {
        if(!this.props.user.Group.includes('Administrators'))
        {
            notification.error({
                message: 'Access Denied',
                description: 'You are not permitted to take this action.'
            })
        }
        else
        {
            this.props.disableRule(id, user); 
        }  
    }

    render() {
        return <Switch checked={this.props.checked} onChange={this.changeSwitch} />
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        rules: state.rules
    }
}

export default connect(mapStateToProps, { enableRule, disableRule })(SwitchWrap);