import React from 'react';
import { connect } from 'react-redux';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Button } from 'antd';
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
        const ButtonGroup = Button.Group;
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
                                
                                <ButtonGroup>
                                    <Button style={{ backgroundColor: this.props.rule.Enabled ? "white" : "#27ae60", color: this.props.rule.Enabled ? "black" : "white" }} size="large" onClick={this.toggleRule}>
                                        OFF
                                    </Button>
                                    <Button style={{ backgroundColor: this.props.rule.Enabled ? "#27ae60" : "white", color: this.props.rule.Enabled ? "white" : "black" }} size="large" onClick={this.toggleRule}>
                                        Monitor
                                    </Button>
                                </ButtonGroup>
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