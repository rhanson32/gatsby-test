import React from 'react';
import { connect } from 'react-redux';

import RuleItem from './RuleItem';
import { getRules } from '../actions';

class RulesPage extends React.Component {
    componentDidMount() {
        this.props.getRules();
    }

    state = {
        Rules: [
            {
                Description: 'Security Group rules open to 0.0.0.0/0',
                Category: 'Security',
                Provider: 'AWS',
                Enabled: true
            },
            {
                Description: 'Abandoned IAM Roles',
                Category: 'Cleanup',
                Provider: 'AWS',
                Enabled: false
            },
            {
                Description: 'Abandoned IAM Users',
                Category: 'Cleanup',
                Provider: 'AWS',
                Enabled: true
            },
            {
                Description: 'S3 Buckets without default encryption',
                Category: 'Security',
                Provider: 'AWS',
                Enabled: false
            },
            {
                Description: 'Unencrypted EBS volumes',
                Category: 'Security',
                Provider: 'AWS',
                Enabled: false
            }
        ],
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
            <div className="rule-list">
                <RuleItem key={this.state.RuleHeader.Description} rule={this.state.RuleHeader} />
                {this.props.Rules.map(rule => {
                    return (
                        <RuleItem key={rule.Description} rule={rule} />
                    )
                })}
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