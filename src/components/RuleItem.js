import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'antd';
import { toggleRule } from '../actions';

class RuleItem extends React.Component {
    state = {
        showDescription: false,
        edit: false
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

    toggleDescription = () => {
        this.setState({
            showDescription: !this.state.showDescription
        });
    }

    addNotification = () => {
        console.log('adding user to notifications');
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
                {!this.state.edit && <p>None</p>}   
                {this.state.edit && (
                    <div className="rules-drawer-configuration">
                        <Input />
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

export default connect(mapStateToProps, { toggleRule })(RuleItem);