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
                <div className="pricing-header">
                    <div className="pricing-overlay">
                        <div className="pricing-header-text">Plans and Pricing</div>
                    </div>
                </div>
                <div className="pricing-cards">
                    <div className="pricing-card">
                        <div className="pricing-card-header">
                            Features
                        </div>
                        <div className="pricing-card-price">
                            $0
                        </div>
                        <div className="pricing-card-description">
                            Description
                        </div>
                        <div className="pricing-card-footer">

                        </div>
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-card-header">
                            Always Free
                        </div>
                        <div className="pricing-card-price">
                            $0
                        </div>
                        <div className="pricing-card-description">
                           <p>
                               For companies that want to evaluate Purify for their business needs or may only care about a small number of controls.
                           </p>
                        </div>
                        <div className="pricing-card-footer">
                            <a className="pricing-card-button">
                                Choose Free
                            </a>
                        </div>
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-card-header">
                            Standard
                        </div>
                        <div className="pricing-card-price">
                            $0 (while in beta)
                        </div>
                        <div className="pricing-card-description">
                            <p>
                                For companies that are ready to take advantage of the full suite of features that Purify offers on all of their accounts.
                            </p>
                        </div>
                        <div className="pricing-card-footer">
                            <a className="pricing-card-button">
                                Buy Standard
                            </a>
                        </div>
                    </div>
                    <div className="pricing-feature-header">
                        Accounts and Users
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-card-description">
                            Number of Users
                        </div>
                        <div className="pricing-card-description">
                            Number of Accounts
                        </div>
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-card-description">
                            5
                        </div>
                        <div className="pricing-card-description">
                            Unlimited
                        </div>
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-card-description">
                            Unlimited
                        </div>
                        <div className="pricing-card-description">
                            Unlimited
                        </div>
                    </div>
                    <div className="pricing-feature-header">
                        Features
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-card-description">
                            Active Rules
                        </div>
                        <div className="pricing-card-description">
                            Cloud Providers
                        </div>
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-card-description">
                            10
                        </div>
                        <div className="pricing-card-description">
                            1
                        </div>
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-card-description">
                        Unlimited
                        </div>
                        <div className="pricing-card-description">
                            1 (AWS, Azure coming in late 2019)
                        </div>
                    </div>
                    <div className="pricing-feature-header">
                        User Authentication
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-card-description">
                            Purify user accounts
                        </div>
                        <div className="pricing-card-description">
                            SAML-based Single Sign-On (SSO)
                        </div>
                        <div className="pricing-card-description">
                            Two-factor Authentication
                        </div>
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-card-description">
                            Unlimited
                        </div>
                        <div className="pricing-card-description">
                            N/A
                        </div>
                        <div className="pricing-card-description">
                            Standard
                        </div>
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-card-description">
                            Unlimited
                        </div>
                        <div className="pricing-card-description">
                            Available
                        </div>
                        <div className="pricing-card-description">
                            Standard
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