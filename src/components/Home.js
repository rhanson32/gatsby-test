import React from 'react'
import { connect } from 'react-redux';
import Splash from './Splash';
import FeatureFocus from './FeatureFocus';
import ExternalHeader from './ExternalHeader';
import SiteMap from './SiteMap';
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
                {this.props.features.length > 0  && <Splash mobileMenu={this.props.mobile.mobileMenu} />}
                <FeatureFocus title="Unlimited Accounts. One View." description="Get one view of all of your accounts, no matter how many you have. See everything at once, and take action on any account with just a few clicks." image={dashboard} />
                <FeatureFocus title="Standards-based Rule Sets" description="Leverage our industry standard-based (CIS, etc) rule sets to quickly align yourself with best practices." image={list} reverse={true} />
                <FeatureFocus title="Transparent Pricing" description="No contracts. No upfront commitments. No volume requirements for discounts. And no percentage costs that grow as your cloud usage grows. Just flat, transparent monthly prices." image={agreement} />
                
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

export default connect(mapStateToProps, null)(Home);