import React from 'react';
import { connect } from 'react-redux';
import { Button, Input, Tag, message } from 'antd';
import { toggleRule, addRuleNotification, removeRuleNotification } from '../actions';

class RuleItem extends React.Component {
    state = {
        showDescription: false,
        email: ``
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

        if(this.props.rules.find(rule => rule.RuleId === this.props.ruleId).Notifications.find(notification => notification === this.state.email))
        {
            message.error('User is already added to this rule');
        }
        else if(this.state.email === '')
        {
            message.error('Invalid entry. Please try again.');
        }
        else if(!this.state.email.includes('@') || !this.state.email.includes('.'))
        {
            message.error('Invalid email format. Please check your entry and try again.');
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
                <h3>{rule.Name}</h3>
                <p> {rule.Description}</p>
                <div className="rule-detail-line">
                <div className="rule-detail-line-header">Category</div>
                <div>{rule.Category}</div>
                </div>
                <div className="rule-detail-line">
                <div className="rule-detail-line-header">Mode</div>
                <div>Monitor</div>
                </div>
                <div className="rule-detail-line">
                <div className="rule-detail-line-header">Exceptions</div>
                <div>None</div>
                </div>
                <div className="rule-detail-line">
                <div className="rule-detail-line-header">Notifications</div>
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
                {(!rule.Notifications || rule.Notifications.length === 0) && <div>None</div>}
                </div>
                {rule.Configurable && (
                    <div className="rules-drawer-configuration">
                        
                        <div className="notification-add-input">
                            <div className="notification-add-input-vertical">
                                <label style={{ width: "100%" }}>Add Notification Email</label>
                            </div>
                            <div className="notification-add-input-bottom">
                                <Input name="email" placeholder="email address" value={this.state.email} onChange={this.handleUpdate} />
                                <Button type="primary" onClick={this.addNotification}>Add</Button>
                            </div>
                        </div>
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