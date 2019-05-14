import React from 'react';
import { connect } from 'react-redux';

import RuleItem from './RuleItem';
import Header from './Header'
import { saveUser, getRules } from '../actions';
import { Auth } from 'aws-amplify'

class RulesPage extends React.Component {
    componentDidMount() {
        console.log(this.props)
        if(!this.props.User.userName)
        {
            Auth.currentAuthenticatedUser().then(user => {
                const userInfo = {
                    ...user.attributes,
                    username: user.username
                  }
                  console.log(userInfo)
                this.props.saveUser(userInfo).then(data => {
                    this.props.getRules(this.props.User.customerId);
                }).catch(err => console.log(err))
            }).catch(err => console.log("Unable to fetch current user."))
        }
        else {
            this.props.getRules(this.props.User.customerId);
        }
        
    }

    state = {
        RuleHeader: {
            Description: 'Description',
            Category: 'Category',
            Name: 'Name',
            Status: 'Status',
            Header: true
        }
    };

    render() {
        return (
            <div>
                <Header />
            <div className="rule-list">
                <RuleItem key={this.state.RuleHeader.Description} rule={this.state.RuleHeader} />
                {this.props.Rules.map(rule => {
                    return (
                        <RuleItem key={rule.ruleId} rule={rule} />
                    )
                })}
            </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        Rules: state.rules,
        User: state.user
    }
}

export default connect(mapStateToProps, { saveUser, getRules })(RulesPage);