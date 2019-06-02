import React from 'react';

const DashboardItem = (props) => (
    <div className="dashboard-item">
        <div className="dashboard-header">
            {props.header}
        </div>
        <div className="dashboard-main">
            <div className="dashboard-metric">
                {props.percent}%
            </div>
            
        </div>
        <div className="dashboard-footer">
            <div>
                {props.status}
            </div>
            <div>
                {props.totals}
            </div>
        </div>
    </div>
)

export default DashboardItem;