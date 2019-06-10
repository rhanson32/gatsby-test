import React from 'react';

const DashboardItem = (props) => (
    <div className="dashboard-item">
        <div className="dashboard-header">
            <div>
                {props.header}
            </div>
            <div className="dashboard-metric">
                {props.percent}%
            </div>
        </div>
        <div className="dashboard-main">
            You have 45 violations across your estate.
        </div>
        <div className="dashboard-footer">
            <div>
                &nbsp;
            </div>
            <div>
                &nbsp;
            </div>
        </div>
    </div>
)

export default DashboardItem;