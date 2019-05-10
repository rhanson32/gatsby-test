import React from 'react';

import ExternalHeader from './ExternalHeader'
import FeatureHeader from './FeatureHeader'
import FeatureFocus from './FeatureFocus'
import ActionCall from './ActionCall'
import SiteMap from './SiteMap'

const Features = () => (
    <div>
        <ExternalHeader />
        <FeatureHeader />
        <FeatureFocus title="Pre-built Rule Sets" />
        <FeatureFocus title="Multi-account. Single pane." />
        <ActionCall />
        <SiteMap />
    </div>
);

export default Features;