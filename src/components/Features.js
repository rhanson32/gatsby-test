import React from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import dashboard from '../../static/dashboard.jpg';
import pay from '../../static/pay.jpg';
import mail from '../../static/undraw_Mail_sent.svg';
import progress from '../../static/undraw_progress_tracking.svg';
import preferences from '../../static/undraw_preferences.svg';
import agreement from '../../static/undraw_agreement.svg';
import cloud from '../../static/undraw_cloud_hosting.svg';
import list from '../../static/undraw_to_do_list.svg';
import dashboardyo from '../../static/undraw_dashboard.svg';
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
                    <img src={circle} />
                    <div className="features-header-message">
                    When your cloud changes, <br />Purify responds in seconds.
                    </div>
                </div>
                
                <div className="feature-header-description">
                    Features
                </div>
                {
                    this.props.features.length > 0 && (
                        <div className="feature-cards">
                            
                            <div className="feature-card-new">
                                <div className="feature-card-new-image">
                                    <img src={list} />
                                </div>
                                <div className="feature-card-new-title" style={{ fontSize: "36px "}}>
                                    Standards-Based Rule Sets
                                </div>
                                <div style={{ width: "500px" }}>
                                    Use our pre-configured rule sets and instantly validate your environment across dozens of industry standards and best practices.
                                </div>
                            </div>
                            <div className="feature-card-new">
                                <div className="feature-card-new-image">
                                    <img src={agreement} />
                                </div>
                                <div className="feature-card-new-title" style={{ fontSize: "36px "}}>
                                    Transparent Pricing
                                </div>
                                <div className="feature-card-new-description" style={{ width: "500px" }}>
                                    No contracts. No upfront commitments. No volume requirements for discounts. And no percentage costs that grow as your cloud usage grows. Just flat, transparent monthly prices.
                                </div>
                            </div>
                            <div  className="feature-card-new">
                                <div style={{ width: "500px" }}>
                                    <img src={preferences} />
                                </div>
                                <div className="feature-card-new-title" style={{ fontSize: "36px "}}>
                                    Audit Trail
                                </div>
                                <div className="feature-card-new-description" style={{ width: "500px" }}>
                                    Audit history of found violations, fixed violations, and more, going back over a year. Snapshots of individual days included.
                                </div>
                            </div>
                            <div className="feature-card-new">
                                <div style={{ width: "500px" }}>
                                    <img src={cloud} />
                                </div>
                                <div className="feature-card-new-title" style={{ fontSize: "36px "}}>
                                    Multi-Cloud
                                </div>
                                <div className="feature-card-new-description" style={{ width: "500px" }}>
                                    AWS support available today. Azure support available by the end of 2019. Additional cloud platform support in 2020.
                                </div>
                            </div>
                            <div className="feature-card-new">
                                <div className="feature-card-new-image">
                                    <img src={mail} />
                                </div>
                                <div className="feature-card-new-title" style={{ fontSize: "36px "}}>
                                    Automated notifications
                                </div>
                                <div className="feature-card-new-description" style={{ width: "500px" }}>
                                    AWS support available today. Azure support available by end of 2019. Additional cloud platform support in 2020.
                                </div>
                            </div>
                            <div className="feature-card-new">
                                <div className="feature-card-new-image">
                                    <img src={progress} />
                                </div>
                                <div className="feature-card-new-title" style={{ fontSize: "36px "}}>
                                    Customize, customize, customize.
                                </div>
                                <div className="feature-card-new-description" style={{ width: "500px" }}>
                                    Purify is built from the ground up to be customizable to your needs. So pilot it with just a few accounts and rules, or turn off rules that don't apply or you don't care about. Then let Purify filter those out automatically. So you see only what you need at all times.
                                </div>
                            </div>
                            <div className="feature-card-new">
                                <div className="feature-card-new-image">
                                    <img src={dashboardyo} />
                                </div>
                                <div className="feature-card-new-title" style={{ fontSize: "36px "}}>
                                    Unlimited Cloud Accounts. One View.
                                </div>
                                <div className="feature-card-new-description" style={{ width: "500px" }}>
                                    Get one view of all of your accounts, no matter how many you have. See everything at once, and take action on any account with just a few clicks.
                                </div>
                            </div>
                            
                        </div>
                    ) 
                }       
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