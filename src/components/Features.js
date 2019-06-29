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
import FeatureCard from './FeatureCard';
import { Card } from 'antd';
import { getFeatures } from '../actions';

const { Meta } = Card;

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
                <div className="feature-cards">
                    <Card
                        hoverable
                        style={{ width: 400, margin: "1rem" }}
                        cover={<img alt="example" src={checklist} />}
                    >
                        <Meta title="Pre-Defined Rule Sets" description="Start out way ahead of the game. Deploy PurifyCloud and immediately get feedback across 100+ parameters about the state of your cloud." />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 400, margin: "1rem" }}
                        cover={<img alt="example" src={pay} />}
                    >
                        <Meta title="Transparent Pricing" description="No contracts. No upfront commitments. No volume requirements for discounts. And no percentage costs that grow as your cloud usage grows. Just flat, transparent monthly prices." />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 400, margin: "1rem" }}
                        cover={<img alt="example" src={accounts} />}
                    >
                        <Meta title="Many Accounts. One View." description="Get one view of all of your accounts, no matter how many you have. See everything at once, and take action on any account with just a few clicks." />
                    </Card>
                </div>
                
                
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