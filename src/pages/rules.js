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
            Status: 'Status'
        }
    };
    
    render() {
        return (
            <div className="app">
                <Header />
                <div className="rule-list">
                    <div className="rule-header">
                        <div>
                        {this.state.RuleHeader.Description}
                        </div>
                        <div>
                            {this.state.RuleHeader.Category}
                        </div>
                        <div>
                        {this.state.RuleHeader.Provider}
                        </div>
                        
                        {this.state.RuleHeader.Status}
                    </div>
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