import React from 'react';
import Header from './Header';
import LeftMenu from './LeftMenu';

const History = () => (
    <div className="history-page">
        <Header />
        <LeftMenu />
        <div className="history-main">
            <div className="support-screen-header">
                <h1>History</h1>
            </div>
        </div>    
    </div>
);

export default History;