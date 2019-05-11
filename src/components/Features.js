import React from 'react';
import { connect } from 'react-redux'

import ExternalHeader from './ExternalHeader'
import FeatureHeader from './FeatureHeader'
import FeatureFocus from './FeatureFocus'
import ActionCall from './ActionCall'
import SiteMap from './SiteMap'

import { getFeatures } from '../actions';

class Features extends React.Component {
    componentDidMount() {
        this.props.getFeatures()
    }

    render() {
        return (
            <div>
                <ExternalHeader />
                <FeatureHeader />
                {
                    this.props.features.map(feature => {
                        return <FeatureFocus key={feature.FeatureId} title={feature.Title} description={feature.Description} />
                    })
                }
                <ActionCall />
                <SiteMap />
            </div>
        )
    }  
}

const mapStateToProps = state => {
    return {
        features: state.features
    }
};

export default connect(mapStateToProps, { getFeatures })(Features);