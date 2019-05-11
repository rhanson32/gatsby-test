import React from 'react';
import ExternalHeader from './ExternalHeader';

const Pricing = () => (
    <div>
        <ExternalHeader />
        <div className="pricing-header">
            Pricing
        </div>
        <div className="pricing-card">
            <div className="pricing-card-header">
                Standard
            </div>
            <div className="pricing-card-price">
                $0 (Beta)
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
            <div>

            </div>
        </div>
    </div>
);

export default Pricing;