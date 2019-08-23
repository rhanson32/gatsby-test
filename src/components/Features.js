import React from 'react';
import { connect } from 'react-redux';

import mail from '../../static/undraw_Mail_sent.svg';
import progress from '../../static/undraw_progress_tracking.svg';
import preferences from '../../static/undraw_preferences.svg';
import agreement from '../../static/undraw_agreement.svg';
import cloud from '../../static/undraw_cloud_hosting.svg';
import list from '../../static/undraw_to_do_list.svg';
import dashboard from '../../static/undraw_dashboard.svg';
import cleanup from '../../static/CleanUp.png';
import team from '../../static/undraw_team_page.svg';
import ExternalHeader from './ExternalHeader';
import SiteMap from './SiteMap';

class Features extends React.Component {
    componentDidMount() {

    }

    render() {
        return (
            <div className="features-page">
                <ExternalHeader />
                <div className="features-header">
                    <img src={cleanup} alt="Clean up your cloud, and keep it clean. With Purify." />
                </div>
                
                <div className="feature-header-description">
                    Features
                </div>
                <div className="feature-cards">
                    
                    <div className="feature-card-new">
                        <div className="feature-card-new-image">
                            <img src={list} alt="Pre-defined rules mean you can get started immediately with minimal effort." />
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
                            <img src={agreement} alt="Know exactly what you are paying and enjoy flat pricing for everything." />
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
                            <img src={preferences} alt="Audit trail shows all events in your cloud." />
                        </div>
                        <div className="feature-card-new-title">
                            Audit Trail
                        </div>
                        <div className="feature-card-new-description">
                            Audit history of found and fixed violations, and more, going back over a year. Historical Snapshots included.
                        </div>
                    </div>
                    <div className="feature-card-new">
                        <div className="feature-card-new-image">
                            <img src={cloud} alt="Supports multiple cloud platforms." />
                        </div>
                        <div className="feature-card-new-title">
                            Multi-Cloud Support
                        </div>
                        <div className="feature-card-new-description">
                            AWS support available today. Azure support available by the end of 2019. Additional cloud platform support in 2020.
                        </div>
                    </div>
                    <div className="feature-card-new">
                        <div className="feature-card-new-image">
                            <img src={mail} alt="Notifications tell you when there's an issue." />
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
                            <img src={progress} alt="Customize our product to your needs." />
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
                            <img src={dashboard} alt="Single dashboard for everything." />
                        </div>
                        <div className="feature-card-new-title">
                            Unlimited Accounts. One View.
                        </div>
                        <div className="feature-card-new-description">
                            Get one view of all your cloud accounts, no matter how many you have. See everything at once, and take action on any account with just a few clicks.
                        </div>
                    </div>
                    <div className="feature-card-new">
                        <div className="feature-card-new-image">
                            <img src={team} alt="Integrate with your existing Active Directory." />
                        </div>
                        <div className="feature-card-new-title">
                            AD Integration
                        </div>
                        <div className="feature-card-new-description">
                            Integrated with Active Directory, so you can log in to Purify with your existing users without having to manage another username and password.
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
};

export default connect(mapStateToProps, null)(Features);