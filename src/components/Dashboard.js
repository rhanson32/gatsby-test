import React from 'react';
import { connect } from 'react-redux'

import DashboardItem from './DashboardItem';
import Header from './Header';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { getCurrentUser } from '../actions'

class Dashboard extends React.Component {
    componentDidMount() {
        this.props.getCurrentUser()
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
                    <div className="dashboard-category-item">
                        <div>
                             S3 Encryption
                        </div>
                    
                    </div>
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
                    <div className="dashboard-category-item">
                        Unused Instances
                    </div>
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
                    <div className="dashboard-category-item">
                        Something, something, something
                    </div>
                </div>
            </div>
        )
    } 
}

const mapStateToProps = state => {
    return {
        User: state.user
    }
}

export default connect(mapStateToProps, { getCurrentUser })(Dashboard);