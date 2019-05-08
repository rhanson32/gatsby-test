import React from "react";

import ExternalHeader from '../components/ExternalHeader';
import FeatureHeader from '../components/FeatureHeader';
import FeatureFocus from '../components/FeatureFocus';
import ActionCall from '../components/ActionCall';
import SiteMap from '../components/SiteMap';

const Features = () => (
    <div className="app">
        <ExternalHeader />
        <FeatureHeader />
        <FeatureFocus title="Pre-built Rule Sets" />
        <FeatureFocus title="Multi-account. Single pane." />
        <ActionCall />
        <SiteMap />
    </div>
);

export default Features;