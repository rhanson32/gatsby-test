import React from 'react';
import { connect } from 'react-redux'

import DashboardItem from './DashboardItem';
import Header from './Header';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { getCurrentUser, getRules } from '../actions'

class Dashboard extends React.Component {
    componentDidMount = async () => {
        if(!this.props.User.email)
        {
            await this.props.getCurrentUser();
            this.props.getRules(this.props.User);
        }
        else
        {
            this.props.getRules(this.props.User);
        }
        
    }

    render() {
        return (
            <div className="dashboard-page">
                <Header />
                <div className="dashboard">
                    <DashboardItem header="Security" percent="95" status="Passing" totals="95 / 100" />
                    <DashboardItem header="Waste" percent="85" status="Passing" totals="85 / 100" />
                    <DashboardItem header="Configuration" percent="77" status="Passing" totals="77 / 100" />
                </div>
                <div className="dashboard-category">
                    <div className="dashboard-category-header">
                        <div>
                            Security
                        </div>
                        <div>
                            23 of 25 rules compliant
                        </div>
                        <div>
                            <button className="rule-arrow">
                                <IoIosArrowDown />
                            </button>
                        </div>
                    </div>
                    {
                        this.props.rules.filter(rule => rule.Category === "Security").map(rule => {
                            return (
                                <div className="dashboard-category-item">
                                    <div>
                                        {rule.Name}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="dashboard-category">
                    <div className="dashboard-category-header">
                        <div>
                            Waste
                        </div>
                        <div>
                            23 of 25 rules compliant
                        </div>
                        <div>
                            <button className="rule-arrow">
                                <IoIosArrowDown />
                            </button>
                        </div>
                    </div>
                    {
                        this.props.rules.filter(rule => rule.Category === "Waste").map(rule => {
                            return (
                                <div className="dashboard-category-item">
                                    <div>
                                        {rule.Name}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="dashboard-category">
                    <div className="dashboard-category-header">
                        <div>
                            Configuration
                        </div>
                        <div>
                            23 of 25 rules compliant
                        </div>
                        <div>
                            <button className="rule-arrow">
                                <IoIosArrowDown />
                            </button>
                        </div>
                    </div>
                    {
                        this.props.rules.filter(rule => rule.Category === "Logging and Monitoring").map(rule => {
                            return (
                                <div className="dashboard-category-item">
                                    <div>
                                        {rule.Name}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    } 
}

const mapStateToProps = state => {
    return {
        User: state.user,
        rules: state.rules
    }
}

export default connect(mapStateToProps, { getCurrentUser, getRules })(Dashboard);