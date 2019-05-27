import React from 'react';
import { connect } from 'react-redux';
import ExternalHeader from './ExternalHeader';
import SiteMap from './SiteMap'
import MobileMenu from './MobileMenu';

class Pricing extends React.Component {

    render() {
        return (
            <div className="pricing-page">
                <ExternalHeader />
                {this.props.mobile.mobileMenu && <MobileMenu />}
                <div className="pricing-overlay">
                    <div className="pricing-overlay-text">
                        Plans and Pricing
                    </div>
                </div>
                <div className="pricing-header">
                </div>
                <div className="pricing-cards">
                    <div className="pricing-card">
                        <div className="pricing-card-header">
                            Free
                        </div>
                        <div className="pricing-card-price">
                            Free always
                        </div>
                        <div className="pricing-card-description">
                            <ul>
                                <li>10 Standard Rules</li>
                                <li>Unlimited accounts</li>
                                <li>Email Notification</li>
                                <li>Real-time Dashboard</li>
                            </ul>
                        </div>
                        <div className="pricing-card-footer">
                            Select
                        </div>
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-card-header">
                            Standard
                        </div>
                        <div className="pricing-card-price">
                            Free (limited time)
                        </div>
                        <div className="pricing-card-description">
                            <p>Everything in Free tier, plus:</p>
                                <ul>
                                    <li>100+ Standard Rules</li>
                                    <li>Automated remediation</li>
                                </ul>
                        </div>
                        <div className="pricing-card-footer">
                            Select
                        </div>
                    </div>
                </div>
                <SiteMap />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        mobile: state.mobile
    }
}

export default connect(mapStateToProps, null)(Pricing);