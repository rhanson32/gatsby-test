import React from 'react'
import { connect } from 'react-redux';
import Splash from './Splash';
import FeatureFocus from './FeatureFocus';
import ExternalHeader from './ExternalHeader';
import MobileMenu from './MobileMenu';
import ActionCall from './ActionCall';
import SiteMap from './SiteMap';
import { getFeatures } from '../actions';

class Home extends React.Component {
    componentDidMount() {
        this.props.getFeatures()
    }

    render() {
        return (
            <div>
                <ExternalHeader />
                {this.props.features.length > 0  && <Splash mobileMenu={this.props.mobile.mobileMenu} />}
                {
                    this.props.features && this.props.features.map((feature, index) => {
                        if(index % 2 === 0)
                        {
                            return <FeatureFocus key={feature.FeatureId} title={feature.Title} description={feature.Description} image={feature.Image} />
                        }
                        else
                        {
                            return <FeatureFocus key={feature.FeatureId} title={feature.Title} description={feature.Description} image={feature.Image} />
                        }
                        
                    })
                }
                {this.props.features.length > 0  && <ActionCall />}
                {this.props.features.length > 0  && <SiteMap />}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        mobile: state.mobile,
        features: state.features
    }
}

export default connect(mapStateToProps, { getFeatures })(Home);