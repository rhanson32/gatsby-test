import React from 'react';

import Header from './Header'

class Dashboard extends React.Component {

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
            </div>
            </div>
        )
    } 
}

export default Dashboard;