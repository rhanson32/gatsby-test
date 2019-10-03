import React from 'react';

class RuleListItem extends React.Component {

    render() {
        return(
            <div className={this.props.index % 2 === 0 ? "rule-list-item even-item" : "rule-list-item"}>
                <div className="rule-list-item-container">
                    {this.props.rule.Name}
                </div>
                <div className="rule-list-item-container">
                    {this.props.rule.Violations.filter(violation => violation.Status === 'Active').length > 0 ? 'Non-Compliant' : 'Compliant'}
                </div>
                <div className="rule-list-item-container">
                    {this.props.rule.Violations.filter(violation => violation.Status === 'Active').length}
                </div>
                <div className="rule-list-item-container">
                    Actions
                </div>
            </div>
        )
    }
}

export default RuleListItem;