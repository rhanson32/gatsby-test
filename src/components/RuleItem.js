import React from 'react';
import { connect } from 'react-redux';
import { Button, Input, Tag, message } from 'antd';
import { toggleRule, addRuleNotification } from '../actions';

class RuleItem extends React.Component {
    state = {
        showDescription: false,
        edit: false
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
        if(this.props.rule.Notifications.find(notification => notification === this.state.email))
        {
            message.error('User is already added to this rule');
        }
        else
        {
            const newRule = {
                ...this.props.rule,
                Notifications: [ ...this.props.rule.Notifications, this.state.email ]
            };

            this.props.addRuleNotification(newRule, this.state.email);
        }
        
    }

    deleteNotification = () => {
        console.log('Deleting notification');
    }

    render() {
        return (
            <div className="rules-drawer">
                <div className="rules-drawer-top">
                <h3>Category</h3>
                <p>{this.props.rule.Category}</p>
                <h3>Mode</h3>
                <p>Monitor</p>
                <h3>Description</h3>
                <p> {this.props.rule.Description}</p>
                <h3>Exceptions</h3>
                <p>None</p>
                <h3>Notifications</h3>
                {
                    this.props.rule.Notifications && this.state.edit && this.props.rule.Notifications.map((notification, index) => {
                        return (
                            <div key={index} className="rule-notification-tag">
                                <Tag color="blue" key={index} closable onClose={() => this.deleteNotification(notification)}>
                                    {notification}
                                </Tag>
                            </div>
                        )
                    })
                } 
                {
                    this.props.rule.Notifications && !this.state.edit && this.props.rule.Notifications.map((notification, index) => {
                        return (
                            <div className="rule-notification-tag">
                            <Tag color="blue" key={index}>
                                {notification}
                            </Tag>
                            </div>
                        )
                    })
                } 
                {!this.props.rule.Notifications && <p>None</p>}
                {this.state.edit && (
                    <div className="rules-drawer-configuration">
                        <label style={{ width: "100%" }}>Email Address</label>
                        <Input name="email" placeholder="email address" value={this.state.email} onChange={this.handleUpdate} />
                        <Button type="primary" onClick={this.addNotification}>Submit</Button>
                    </div>
                )} 
                </div>
                <div className="rules-drawer-bottom">            
                    {this.props.rule.Configurable && !this.state.edit && <Button type="primary" onClick={this.editRule}>Configure</Button>}
                    {this.props.rule.Configurable && this.state.edit && <Button type="primary" onClick={this.completeUpdates}>Done</Button>}
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

export default connect(mapStateToProps, { toggleRule, addRuleNotification })(RuleItem);