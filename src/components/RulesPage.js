import React from 'react';
import { connect } from 'react-redux';
import { IoMdFunnel } from 'react-icons/io';
import Loading from './Loading';
import RuleItem from './RuleItem';
import Header from './Header'
import { saveUser, getRules, getCurrentUser } from '../actions';

class RulesPage extends React.Component {

    state = {
        showFilters: false
    }

    componentDidMount = async () => {
        console.log(this.props)
        if(!this.props.User.email)
        {
            await this.props.getCurrentUser()
            this.props.getRules(this.props.User)
        }
        else {
            this.props.getRules(this.props.User);
        }
        
    }

    toggleFilterMenu = () => {
        this.setState({
            showFilters: !this.state.showFilters
        })
    }

    render() {
        console.log(this.props);
        return (
            <div>
                <Header />
                <div className="rules">
                {
                    this.props.Rules.length === 0 && (
                        <Loading type="spokes" color="333"/>
                    )
                }
                <div className="filter-menu">
                    <a className="filter-button" onClick={this.toggleFilterMenu}>
                        <IoMdFunnel />
                        &nbsp; Filter
                    </a>
                    
                </div>
                {
                    this.props.Rules.length !== 0 && (
                        <div className="rules-bulk-switch">
                            <a>Enable All Rules</a>
                            <a>Disable All Rules</a>
                        </div>
                    )
                }
                {
                    this.state.showFilters && (
                        <div className="filters">
                            <label>Category:</label>
                            <a className="filter">
                                <select>
                                    <option>Security</option>
                                    <option>Waste</option>
                                    <option>Configuration</option>
                                </select>
                            </a>
                            <label>Status:</label>
                            <a className="filter">
                                <select>
                                    <option>Monitor</option>
                                    <option>Remediate</option>
                                    <option>Off</option>
                                </select>
                            </a>
                        </div>
                    )
                }
                {
                    this.props.Rules.length !== 0 && (
                        <div className="rule-list">
                            <div className="rule-header">
                                <div className="rule-name">
                                    Name
                                </div>
                                <div className="rule-category">
                                    Category
                                </div>
                                <div className="rule-status">
                                    Status
                                </div>
                            </div>
                            {this.props.Rules.map((rule, index) => {
                                return (
                                    <RuleItem key={index} rule={rule} />
                                )
                            })}
                        </div>
                    )
                }  
                </div> 
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        Rules: state.rules,
        User: state.user
    }
}

export default connect(mapStateToProps, { saveUser, getRules, getCurrentUser })(RulesPage);