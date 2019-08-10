import React from 'react'
import { connect } from 'react-redux';
import Splash from './Splash';
import FeatureFocus from './FeatureFocus';
import ExternalHeader from './ExternalHeader';
import SiteMap from './SiteMap';
import dashboard from '../../static/undraw_dashboard.svg';
import { getFeatures } from '../actions';

class Home extends React.Component {
    componentDidMount() {
        this.props.getFeatures()
    }

    render() {
        return (
            <div className="home">
                <ExternalHeader />
                {this.props.features.length > 0  && <Splash mobileMenu={this.props.mobile.mobileMenu} />}
                <FeatureFocus title="Many Accounts. One View." description="Get one view of all of your accounts, no matter how many you have. See everything at once, and take action on any account with just a few clicks." image={dashboard} />
                {this.props.features && this.props.features.map((feature, index) => <FeatureFocus index={index} key={feature.FeatureId} title={feature.Title} description={feature.Description} image={feature.Image} />)}
                
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