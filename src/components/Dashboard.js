import React from 'react';
import { connect } from 'react-redux'

import Header from './Header'
import { getCurrentUser } from '../actions'

class Dashboard extends React.Component {
    componentDidMount() {
        this.props.getCurrentUser()
    }

    render() {
        return (
            <div>
                <Header />
            <div className="dashboard">
                <div className="dashboard-item">
                    <div className="dashboard-header">
                        Security
                    </div>
                    <div className="dashboard-main">
                        <div className="dashboard-metric">
                            95%
                        </div>
                        
                    </div>
                    <div className="dashboard-footer">
                        <div>
                            Passing
                        </div>
                        <div>
                            95 / 100
                        </div>
                    </div>
                </div>
                <div className="dashboard-item">
                    <div className="dashboard-header">
                        Waste
                    </div>
                    <div className="dashboard-main">
                        <div className="dashboard-metric">
                                95%
                        </div>
                    </div>
                    <div className="dashboard-footer">
                        <div>
                            Passing
                        </div>
                        <div>
                            95 / 100
                        </div>
                    </div>
                </div>
                <div className="dashboard-item">
                    <div className="dashboard-header">
                        Misconfiguration
                    </div>
                    <div className="dashboard-main">
                        <div className="dashboard-metric">
                            95%
                        </div>
                    </div>
                    <div className="dashboard-footer">
                        <div>
                            View Violations
                        </div>
                        <div>
                            95 / 100
                        </div>
                    </div>
                </div>
                <div className="dashboard-category">
                    <div className="dashboard-category-header">
                        Security
                    </div>
                    <div className="dashboard-category-item">
                        S3 Encryption
                    </div>
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