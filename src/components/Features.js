import React from 'react';
import { FaTasks, FaRocket, FaHistory } from 'react-icons/fa';

import FeatureItem from '../components/FeatureItem';

const Features = () => (
    <div>
        <div className="feature-header-title">
            Your cloud governance hub
        </div>
        <div className="feature-header-description">
            Platform security, waste cleanup, configuration optimization: these necessary operational activities are our specialty. Let us take care of them for you while you focus on higher-value tasks for your business.
        </div>
        <div className="feature-items">
            <FeatureItem title="Pre-Defined Rule Sets" icon={<FaTasks className="feature-icon" />} description="100+ pre-defined rules out of the box, based on industry best practices and real-world experience. Custom rule sets coming soon!" />
            <FeatureItem title="Automated Remediation" icon={<FaRocket className="feature-icon" />} description="Identify issues in real-time. Notify someone. Fix the issue on the spot without human intervention. Or both." />
            <FeatureItem title="Audit Compliance" icon={<FaHistory className="feature-icon" />} description="One-click reporting on your current state or a full history of your accounts over time." />
            <FeatureItem title="TBD" />
        </div>
    </div>
);

export default Features;