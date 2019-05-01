import React from "react";

import Header from '../components/Header';
import RuleItem from '../components/RuleItem';

class Rules extends React.Component { 

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
            <div className="app">
                <Header />
                <div className="rule-list">
                    <RuleItem key={this.state.RuleHeader.Description} rule={this.state.RuleHeader} />
                    {this.state.Rules.map(rule => {
                        return (
                            <RuleItem key={rule.Description} rule={rule} />
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Rules;