import React from 'react'
import { connect } from 'react-redux';
import Splash from './Splash';
import FeatureFocus from './FeatureFocus';
import ExternalHeader from './ExternalHeader';
import SiteMap from './SiteMap';
import { Icon } from 'tabler-react';
import { Link } from '@reach/router';
import dashboard from '../../static/undraw_dashboard.svg';
import list from '../../static/undraw_to_do_list.svg';
import agreement from '../../static/undraw_agreement.svg';

class Home extends React.Component {
    componentDidMount() {
    }

    render() {
        return (
            <div className="home">
                <ExternalHeader />
                <Splash mobileMenu={this.props.mobile.mobileMenu} />
                <FeatureFocus title="Unlimited Accounts. One View." description="See one view of all your accounts, no matter how many you have. View everything at once, and take action on any account with just a few clicks." image={dashboard} />
                <FeatureFocus title="Standards-based Rule Sets" description="Leverage our industry standard-based (CIS) rule sets to quickly align yourself with proven best practices." image={list} reverse={true} />
                <FeatureFocus title="Transparent Pricing" description="No contracts. No upfront commitments. No volume requirements for discounts. And no percentage costs that grow as your cloud usage grows. Just flat, transparent monthly prices." image={agreement} />
                <div className="feature-teaser">
                    <Link to="/app/features">See the rest of our features <Icon name="arrow-right" /></Link>
                </div>
                <SiteMap />
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

export default connect(mapStateToProps, null)(Home);