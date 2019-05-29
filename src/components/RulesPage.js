import React from 'react';
import { connect } from 'react-redux';

import RuleItem from './RuleItem';
import Header from './Header'
import { saveUser, getRules, getCurrentUser } from '../actions';

class RulesPage extends React.Component {
    componentDidMount = async () => {
        console.log(this.props)
        if(!this.props.User.email)
        {
            await this.props.getCurrentUser()
            this.props.getRules(this.props.User)
        }
        else {
            this.props.getRules(this.props.User);
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
        console.log(this.props);
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

export default connect(mapStateToProps, { saveUser, getRules, getCurrentUser })(RulesPage);