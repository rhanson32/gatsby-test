import React from 'react';
import { connect } from 'react-redux';
import { Button, Input, Tag, message } from 'antd';
import { toggleRule, addRuleNotification, removeRuleNotification } from '../actions';

class RuleItem extends React.Component {
    state = {
        showDescription: false
    }

    handleUpdate = (event) => {
        this.setState({
          [event.target.name]: event.target.value,
        })
      }

    enableRule = (event) => {
        const enabledCount = this.props.Rules.filter(rule => rule.Enabled).length;
        console.log(enabledCount);
        
        if(enabledCount >= 10 && this.props.User.Plan === "Free")
        {
            console.log("Cannot add more rules. Please upgrade to the Standard Plan to enable more rules.");
            this.error();
        }
        else
        {
            this.props.enableRule(event.target.id, this.props.User); 
        }
    }

    disableRule = (event) => {
        this.props.disableRule(event.target.id, this.props.User); 
    }

    toggleRule = (event) => {
        this.props.toggleRule(this.props.rule.RuleId, this.props.user); 
        console.log(event.target.name);
    }

    editRule = () => {
        this.setState({
            edit: true
        });
    }

    completeUpdates = () => {
        this.setState({
            edit: false
        });
    }

    toggleDescription = () => {
        this.setState({
            showDescription: !this.state.showDescription
        });
    }

    addNotification = () => {
        console.log('adding user to notifications');
        console.log(this.state.email);
        if(this.props.rules.find(rule => rule.RuleId === this.props.ruleId).Notifications.find(notification => notification === this.state.email))
        {
            message.error('User is already added to this rule');
        }
        else
        {
            const newRule = {
                ...this.props.rules.find(rule => rule.RuleId === this.props.ruleId),
                Notifications: [ ...this.props.rules.find(rule => rule.RuleId === this.props.ruleId).Notifications, this.state.email ]
            };

            this.props.addRuleNotification(newRule, this.state.email);
        }
        this.setState({
            email: ``
        });
    }

    deleteNotification = (notification) => {
        this.props.removeRuleNotification(this.props.ruleId, notification);
    }

    render() {
        const rule = this.props.rules.find(rule => rule.RuleId === this.props.ruleId);
        return (
            <div className="rules-drawer">
                <div className="rules-drawer-top">
                <h3>Category</h3>
                <p>{rule.Category}</p>
                <h3>Mode</h3>
                <p>Monitor</p>
                <h3>Description</h3>
                <p> {rule.Description}</p>
                <h3>Exceptions</h3>
                <p>None</p>
                <h3>Notifications</h3>
                {
                    rule.Notifications && rule.Notifications.map((notification, index) => {
                        return (
                            <div key={index} className="rule-notification-tag">
                                <Tag color="blue" key={index} closable onClose={() => this.deleteNotification(notification)}>
                                    {notification}
                                </Tag>
                            </div>
                        )
                    })
                }  
                {!rule.Notifications && <p>None</p>}
                {rule.Configurable && (
                    <div className="rules-drawer-configuration">
                        <label style={{ width: "100%" }}>Email Address</label>
                        <Input name="email" placeholder="email address" value={this.state.email} onChange={this.handleUpdate} />
                        <Button type="primary" onClick={this.addNotification}>Submit</Button>
                    </div>
                )} 
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        rules: state.rules
    }
}

export default connect(mapStateToProps, { toggleRule, addRuleNotification, removeRuleNotification })(RuleItem);