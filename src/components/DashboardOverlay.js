import React from 'react';
import { Loader } from 'tabler-react';

const DashboardOverlay = () => (
    <div className="dashboard-overlay">
        <Loader />
        <div style={{ fontSize: '32px' }}>Loading...</div>
        
    </div>
);

export default DashboardOverlay;