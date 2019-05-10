import React from 'react';
import { connect } from 'react-redux';

import RuleItem from './RuleItem';
import Header from './Header'
import { getRules } from '../actions';

class RulesPage extends React.Component {
    componentDidMount() {
        this.props.getRules();
    }

    state = {
        RuleHeader: {
            Description: 'Description',
            Category: 'Category',
            Provider: 'Provider',
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
                        <RuleItem key={rule.Description} rule={rule} />
                    )
                })}
            </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        Rules: state.rules
    }
}

export default connect(mapStateToProps, { getRules })(RulesPage);