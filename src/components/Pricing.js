import React from 'react';
import { connect } from 'react-redux';
import { PricingCard, Icon } from 'tabler-react';
import ExternalHeader from './ExternalHeader';
import SiteMap from './SiteMap';
import { navigate } from '@reach/router';

class Pricing extends React.Component {

    signUp = () => {
        navigate('/app/signup');
    }

    render() {
        return (
            <div className="pricing-page">
                <ExternalHeader />
                
                <div className="pricing-main">
                <div className="pricing-header-new">
                    Pricing
                </div>
                <div className="pricing-description">
                    All prices shown are monthly subscription prices.
                </div>
                <div className="pricing-note">
                    Note: Our product is currently in beta. For a limited time, use the code 'PURIFYFREE' at checkout to upgrade to the Standard plan for free for 3 months.
                </div>
                <div className="pricing-cards">
                
                <div  className="pricing-card-new">
                <PricingCard active={true}>
                    <PricingCard.Category>
                        Free
                    </PricingCard.Category>
                    <PricingCard.Price>
                        $0
                    </PricingCard.Price>
                    <PricingCard.AttributeList>
                        <PricingCard.AttributeItem>
                            5 Users
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            3 Accounts
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            10 Active Rules
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            1 Cloud Provider
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="green-icon" name="check" /> Notifications
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="green-icon" name="check" /> 2-Factor Authentication
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="green-icon" name="check" /> Email Support
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="red-icon" name="x" /> Automated Remediation
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="red-icon" name="x" /> Audit Trail
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="red-icon" name="x" /> Latest Features
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="red-icon" name="x" /> Ticket Support & SLA
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="red-icon" name="x" /> SAML-based Single Sign-On
                        </PricingCard.AttributeItem>
                    </PricingCard.AttributeList>
                    <PricingCard.Button active={true} onClick={this.signUp}>
                        Sign Up
                    </PricingCard.Button>
                </PricingCard>
                </div>
                <div  className="pricing-card-new">
                <PricingCard>
                    <PricingCard.Category>
                        Standard
                    </PricingCard.Category>
                    <PricingCard.Price>
                        $299
                    </PricingCard.Price>
                    <PricingCard.AttributeList>
                        <PricingCard.AttributeItem>
                            Unlimited Users
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            Unlimited Accounts
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            Unlimited Rules
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            Multiple Cloud Providers
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="green-icon" name="check" /> Notifications
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="green-icon" name="check" /> 2-Factor Authentication
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="green-icon" name="check" /> Email Support
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="green-icon" name="check" /> Automated Remediation
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="green-icon" name="check" /> Audit Trail
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="green-icon" name="check" /> Latest Features
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="green-icon" name="check" /> Ticket Support & SLA
                        </PricingCard.AttributeItem>
                        <PricingCard.AttributeItem>
                            <Icon className="green-icon" name="check" /> SAML-based Single Sign-On
                        </PricingCard.AttributeItem>
                    </PricingCard.AttributeList>
                    <p>&nbsp;</p>
                   <div>
                       In-App Upgrade
                   </div>
                </PricingCard>
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