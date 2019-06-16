import React from 'react';
import { connect } from 'react-redux';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { toggleRule } from '../actions';

class RuleItem extends React.Component {
    state = {
        showDescription: false
    }

    toggleRule = (event) => {
        this.props.toggleRule(this.props.rule.RuleId, this.props.user); 
        console.log(event.target.name);
    }

    toggleDescription = () => {
        this.setState({
            showDescription: !this.state.showDescription
        });
    }
    render() {
        return (
            <div className={this.props.rule.Header ? "rule-header" : "rule-item"}>
                <div className="rule-name">
                    {this.props.rule.Name}{"  "}
                    {!this.state.showDescription && <button className="rule-arrow-dark" onClick={this.toggleDescription}><IoIosArrowDown /></button>}
                    {this.state.showDescription && <button className="rule-arrow-dark" onClick={this.toggleDescription}><IoIosArrowUp /></button>}
                </div>
                <div className="rule-category">
                    {this.props.rule.Category}
                </div>
                {
                    !this.props.rule.Header && (
                        <div className="rule-status">
                            <div className="button-group">
                                <button name="off" onClick={this.toggleRule} className={this.props.rule.Enabled === true ? 'disabled-button' : "enabled-button"}>
                                    OFF
                                </button>
                                <button name="monitor" onClick={this.toggleRule} className={this.props.rule.Enabled === true ? 'enabled-button' : "disabled-button"}>
                                    Monitor
                                </button>
                            </div>
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