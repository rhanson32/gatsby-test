import React from 'react';
import { connect } from 'react-redux';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { toggleRule } from '../actions';

class RuleItem extends React.Component {
    state = {
        showDescription: false
    }

    toggleRule = (id) => {
        console.log(this.props);
        this.props.toggleRule(this.props.rule.RuleId, this.props.user);

    }

    toggleDescription = () => {
        this.setState({
            showDescription: !this.state.showDescription
        });
    }
    render() {
        console.log(this.props);
        return (
            <div className={this.props.rule.Header ? "rule-header" : "rule-item"}>
                <div className="rule-name">
                    {this.props.rule.Name}{"  "}
                    {!this.state.showDescription && <button className="rule-arrow" onClick={this.toggleDescription}><IoIosArrowDown /></button>}
                    {this.state.showDescription && <button className="rule-arrow" onClick={this.toggleDescription}><IoIosArrowUp /></button>}
                </div>
                <div className="rule-category">
                    {this.props.rule.Category}
                </div>
                {
                    !this.props.rule.Header && (
                        <div className="rule-status">
                            <button onClick={this.toggleRule} className={`${this.props.rule.Enabled === true ? 'enabled-button' : "disabled-button"}`}>
                                {this.props.rule.Enabled ? "ON": "OFF"}
                            </button>
                        </div>
                    )
                } 
                {
                    this.state.showDescription && (
                        <div className="rule-description">
                            {this.props.rule.Description}
                        </div>
                    )
                }  
                {
                    this.props.rule.Header && (
                        <div className="rule-status">
                            Status
                        </div>
                    )
                }
                   
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { toggleRule })(RuleItem);