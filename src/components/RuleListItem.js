import React from 'react';
import { Icon } from 'antd';
import moment from 'moment';

class RuleListItem extends React.Component {
    state = {
        showDetail: false
    }

    toggleShow = () => {
        this.setState({
            showDetail: !this.state.showDetail
        });
    }

    render() {
        return(
            <div index={this.props.index} className="rule-container">
                <button onClick={this.toggleShow}>
                    <div className="rule-list-item">
                        <div className="rule-list-item-container-wide">
                            {!this.state.showDetail && <Icon type="right-circle" theme="twoTone" /> }
                            {this.state.showDetail && <Icon type="down-circle" theme="twoTone" /> }
                            &nbsp;{` ${this.props.rule.Name}`}
                        </div>
                        <div className="rule-list-item-container">
                            {this.props.rule.Enabled ? 'Enabled' : 'Disabled'}
                        </div>
                        <div className="rule-list-item-container">
                            {this.props.rule.Violations.filter(violation => violation.Status === 'Active').length}
                        </div>
                        <div className="rule-list-item-container">
                            {this.props.rule.Violations.filter(violation => violation.Status === 'Active').length > 0 ? 'Non-Compliant' : 'Compliant'}
                        </div>
                    </div>
                </button>
                {this.state.showDetail && (
                    <div className={this.state.showDetail ? "rule-detail show" : "rule-detail hide"}>
                        <div className="rule-detail-item">
                            <div>
                                Resource Id
                            </div>
                            <div>
                                Account Id
                            </div>
                            <div>
                                Resource Type
                            </div>
                            <div>
                                Violation Date
                            </div>
                        </div>
                        {this.props.rule.Violations.filter(violation => violation.Status === 'Active').length > 0 && this.props.rule.Violations.filter(violation => violation.Status === 'Active').map((violation, index) => {
                            return (
                                <div key={index} className="rule-detail-item">
                                    <div>
                                        {violation.ResourceId}
                                    </div>
                                    <div>
                                        {violation.AccountId}
                                    </div>
                                    <div>
                                        {violation.ResourceType}
                                    </div>
                                    <div>
                                        {moment(parseInt(violation.ViolationDate)*1000).format('MMM DD YYYY hh:mm a')}
                                    </div>
                                </div>
                            )
                        })}
                        {
                            this.props.rule.Violations.filter(violation => violation.Status === 'Active').length === 0 && (
                                <div>
                                    No active violations at this time for this rule.
                                </div>
                            )
                        }
                    </div>
                )}
            </div>
        )
    }
}

export default RuleListItem;