import React from 'react';
import { connect } from 'react-redux';
import { IoMdFunnel } from 'react-icons/io';
import Loading from './Loading';
import RuleItem from './RuleItem';
import Header from './Header'
import { saveUser, getRules, getCurrentUser } from '../actions';
import LeftMenu from './LeftMenu';

class RulesPage extends React.Component {

    state = {
        showFilters: false,
        Category: "All",
        Status: "All"
    }

    componentDidMount = async () => {
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

    handleUpdate = (event) => {
        this.setState({
          [event.target.name]: event.target.value,
        })
      }

    render() {
        return (
            <div className="rules-page">
                <Header />
                <LeftMenu />
                <div className="rules">
                {
                    this.props.Rules.length === 0 && (
                        <Loading type="spokes" color="333"/>
                    )
                }
                <div className="rules-options">
                    <div className="filter-menu">
                        <a className={this.state.showFilters ? "filter-button button-selected" : "filter-button button-unselected"} onClick={this.toggleFilterMenu}>
                            <IoMdFunnel />
                            &nbsp; Filter
                        </a>
                    </div>
                    {
                        this.props.Rules.length !== 0 && (
                            <div className="rules-bulk-switch">
                                <a>Enable All</a>
                                <a>Disable All</a>
                            </div>
                        )
                    }
                </div>
                {
                    this.state.showFilters && (
                        <div className="filters">
                            <div className="filter-container">
                                <label>CATEGORY</label>
                                <a className="filter">
                                    <select onChange={this.handleUpdate} name="Category">
                                        <option value="All">All</option>
                                        <option value="Security">Security</option>
                                        <option value="Waste">Waste</option>
                                        <option value="Configuration">Configuration</option>
                                    </select>
                                </a>
                            </div>
                            <div className="filter-container">
                                <label>STATUS</label>
                                <a className="filter">
                                    <select onChange={this.handleUpdate} name="Status">
                                        <option value="All">All</option>
                                        <option value="Monitor">Monitor</option>
                                        <option value="Remediate">Remediate</option>
                                        <option value="Off">Off</option>
                                    </select>
                                </a>
                            </div>
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
                            {
                                this.state.Category === "All" && this.props.Rules.map((rule, index) => {
                                    return <RuleItem key={index} rule={rule} />
                                })
                            }
                            {
                                this.state.Category === "Security" && this.props.Rules.filter(rule => rule.Category === "Security").map((rule, index) => {
                                    return <RuleItem key={index} rule={rule} />
                                })
                            }
                            {
                                this.state.Category === "Waste" && this.props.Rules.filter(rule => rule.Category === "Waste").map((rule, index) => {
                                    return <RuleItem key={index} rule={rule} />
                                })
                            }
                            {
                                this.state.Category === "Configuration" && this.props.Rules.filter(rule => rule.Category === "Configuration").map((rule, index) => {
                                    return <RuleItem key={index} rule={rule} />
                                })
                            }
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