import React from 'react';
import { connect } from 'react-redux'
import accounts from '../../static/accounts.png';
import pay from '../../static/pay.jpg';
import checklist from '../../static/checklist.jpg';
import ExternalHeader from './ExternalHeader';
import FeatureHeader from './FeatureHeader';
import FeatureFocus from './FeatureFocus';
import ActionCall from './ActionCall';
import SiteMap from './SiteMap';
import MobileMenu from './MobileMenu';
import Loading from './Loading';

import { getFeatures } from '../actions';

class Features extends React.Component {
    componentDidMount() {
        this.props.getFeatures()
    }

    render() {
        return (
            <div>
                <ExternalHeader />
                {this.props.features.length === 0 && <Loading type="spokes" coloe="#777" />}
                {this.props.mobile.mobileMenu && <MobileMenu />}
                {this.props.features.length > 0 && <FeatureHeader />}
                {
                    this.props.features.map((feature, index) => {

                        if(feature.Title.includes("Accounts"))
                        {
                            return <FeatureFocus key={feature.FeatureId} title={feature.Title} description={feature.Description} image={accounts} />
                        }
                        else if(feature.Title.includes("Rule Sets"))
                        {
                            return <FeatureFocus key={feature.FeatureId} title={feature.Title} description={feature.Description} image={checklist} />
                        }
                        else
                        {
                            return <FeatureFocus key={feature.FeatureId} title={feature.Title} description={feature.Description} image={pay} />
                        }
                        
                    })
                }
                {this.props.features.length > 0 && <ActionCall />}
                {this.props.features.length > 0 && <SiteMap />}
            </div>
        )
    }  
}

const mapStateToProps = state => {
    return {
        features: state.features,
        mobile: state.mobile
    }
};

export default connect(mapStateToProps, { getFeatures })(Features);