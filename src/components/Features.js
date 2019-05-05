import React from 'react';

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
            <FeatureItem title="Security" />
            <FeatureItem title="Waste Cleanup" />
            <FeatureItem title="Optimization" />
            <FeatureItem title="TBD" />
        </div>
    </div>
);

export default Features;