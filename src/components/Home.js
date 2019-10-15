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
                <FeatureFocus title="One View of Everything." description="See one consolidated view of every cloud account, no matter how many you have. View everything at once, and take action with just a few clicks." image={dashboard} />
                <FeatureFocus title="Best Practices. Out of the Box." description="Align your accounts with accepted best practices with just a few clicks. No configuration required." image={list} reverse={true} />
                <FeatureFocus title="Transparent Pricing" description="No contracts. No upfront commitments. No volume requirements for discounts. Just flat, transparent monthly pricing." image={agreement} />
                <div className="feature-teaser">
                    <Link to="/app/features#Top">See the rest of our features <Icon name="arrow-right" /></Link>
                    <div className="feature-questions">Questions? Email us at info@purify.cloud.</div>
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