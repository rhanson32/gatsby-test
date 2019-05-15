import React from 'react';
import ExternalHeader from './ExternalHeader';
import SiteMap from './SiteMap'

const Pricing = () => (
    <div>
        <ExternalHeader />
        <div className="pricing-overlay">
            <div className="pricing-overlay-text">
                Plans and Pricing
            </div>
        </div>
        <div className="pricing-header">
        </div>
        <div className="pricing-card">
            <div className="pricing-card-header">
                Standard
            </div>
            <div className="pricing-card-price">
                Free (beta)
            </div>
            <div className="pricing-card-description">
                <ul>
                    <li>100+ Standard Rules</li>
                    <li>Automated remediation</li>
                    <li>Unlimited accounts</li>
                    <li>Email Notification</li>
                    <li>Real-time Dashboard</li>
                </ul>
            </div>
            <div className="pricing-card-footer">
                Select
            </div>
        </div>
        <SiteMap />
    </div>
);

export default Pricing;