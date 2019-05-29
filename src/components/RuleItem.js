import React from 'react';
import { connect } from 'react-redux';

import { toggleRule } from '../actions';

class RuleItem extends React.Component {
    state = {
        showDescription: false
    }

    toggleRule = (id) => {
        console.log(this.props);
        this.props.toggleRule(this.props.rule.RuleId);

    }

    toggleDescription = () => {
        this.setState({
            showDescription: !this.state.showDescription
        });
    }
    render() {
        return (
            <div className={this.props.rule.Header ? "rule-header" : "rule-item"}>
                <div className="rule-detail">
                    <div className="rule-description">
                        <div>
                            {this.props.rule.Name}{" "}
                            <button onClick={this.toggleDescription}>Click Me</button>
                        </div>
                        {
                            this.state.showDescription && (
                                <div>
                                    {this.props.rule.Description}
                                </div>
                            )
                        }
                        
                        
                    </div>
                    <div className="rule-category">
                        {this.props.rule.Category}
                    </div>
                </div>
                {
                    this.props.rule.Header && (
                        <div className="rule-status">
                            Status
                        </div>
                    )
                }
                {
                    !this.props.rule.Header && (
                        <div className="rule-status">
                            <button onClick={this.toggleRule} className={`${this.props.rule.Enabled === true ? 'enabled-button' : "disabled-button"}`}>
                                {this.props.rule.Enabled ? "ON": "OFF"}
                            </button>
                        </div>
                    )
                }    
            </div>
        )
    }
}

export default connect(null, { toggleRule })(RuleItem);