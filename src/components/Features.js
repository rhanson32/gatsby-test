import React from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import mail from '../../static/undraw_Mail_sent.svg';
import progress from '../../static/undraw_progress_tracking.svg';
import preferences from '../../static/undraw_preferences.svg';
import agreement from '../../static/undraw_agreement.svg';
import cloud from '../../static/undraw_cloud_hosting.svg';
import list from '../../static/undraw_to_do_list.svg';
import dashboard from '../../static/undraw_dashboard.svg';
import sync from '../../static/undraw_synchronize.svg';
import checklist from '../../static/checklist.jpg';
import circle from '../../static/circle.png';
import ExternalHeader from './ExternalHeader';
import SiteMap from './SiteMap';
import { Card } from 'antd';
import { getFeatures } from '../actions';

const { Meta } = Card;

class Features extends React.Component {
    componentDidMount() {
        this.props.getFeatures();
    }

    render() {
        return (
            <div className="features-page">
                <ExternalHeader />
                {this.props.features.length === 0 && <Spin tip="Loading..." style={{ margin: "40vh auto 0 auto", width: "100vw", height: "100vh" }} size="large" />}
                <div className="features-header">
                    <img src={sync} />
                    <div className="features-header-message">
                    When your cloud changes, <br />Purify responds in seconds.
                    </div>
                </div>
                
                <div className="feature-header-description">
                    Features
                </div>
                <div className="feature-cards">
                    
                    <div className="feature-card-new">
                        <div className="feature-card-new-image">
                            <img src={list} />
                        </div>
                        <div className="feature-card-new-title">
                            Standards-Based Rule Sets
                        </div>
                        <div className="feature-card-new-description">
                            Use our pre-configured rule sets and instantly validate your environment across dozens of industry standards and best practices.
                        </div>
                    </div>
                    <div className="feature-card-new">
                        <div className="feature-card-new-image">
                            <img src={agreement} />
                        </div>
                        <div className="feature-card-new-title">
                            Transparent Pricing
                        </div>
                        <div className="feature-card-new-description">
                            No contracts. No upfront commitments. No volume requirements for discounts. And no percentage costs that grow as your cloud usage grows. Just flat, transparent monthly prices.
                        </div>
                    </div>
                    <div className="feature-card-new">
                        <div className="feature-card-new-image">
                            <img src={preferences} />
                        </div>
                        <div className="feature-card-new-title">
                            Audit Trail
                        </div>
                        <div className="feature-card-new-description">
                            Audit history of found violations, fixed violations, and more, going back over a year. Snapshots of individual days included.
                        </div>
                    </div>
                    <div className="feature-card-new">
                        <div className="feature-card-new-image">
                            <img src={cloud} />
                        </div>
                        <div className="feature-card-new-title">
                            Multi-Cloud
                        </div>
                        <div className="feature-card-new-description">
                            AWS support available today. Azure support available by the end of 2019. Additional cloud platform support in 2020.
                        </div>
                    </div>
                    <div className="feature-card-new">
                        <div className="feature-card-new-image">
                            <img src={mail} />
                        </div>
                        <div className="feature-card-new-title">
                            Automated notifications
                        </div>
                        <div className="feature-card-new-description">
                            Know about every violation of every rule, as soon as it's discovered. Or only certain categories. Or individual rules. It's your choice.
                        </div>
                    </div>
                    <div className="feature-card-new">
                        <div className="feature-card-new-image">
                            <img src={progress} />
                        </div>
                        <div className="feature-card-new-title">
                            Customize, customize, customize.
                        </div>
                        <div className="feature-card-new-description">
                            Purify is built from the ground up to be customizable to your needs. So pilot it with just a few accounts and rules, or turn off rules that don't apply or you don't care about. Then let Purify filter those out automatically. So you see only what you need at all times.
                        </div>
                    </div>
                    <div className="feature-card-new">
                        <div className="feature-card-new-image">
                            <img src={dashboard} />
                        </div>
                        <div className="feature-card-new-title">
                            Unlimited Accounts. One View.
                        </div>
                        <div className="feature-card-new-description">
                            Get one view of all your cloud accounts, no matter how many you have. See everything at once, and take action on any account with just a few clicks.
                        </div>
                    </div>
                    
                </div>
       
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