import React from 'react';
import { Link } from 'gatsby';

const GettingStarted = () => (
    <div className="docs-section">
        <h1>Getting Started</h1>
        <h2>Setting Up MFA on your main account</h2>
        <p>The account you use to sign up to Purify is your default administrator account. We recommend that you set up Multi-Factor Authentication on this account immediately to prevent unauthorized use of this account.</p>
        <p>To set up MFA on your main Purify account, log in to Purify using the main account, then:
            <ol>
                <li>Visit the Settings page.</li>
                <li>Select 'Enable MFA' on the General tab.</li>
                <li>Using any authenticator app that supports QR codes (e.g. Google Authenticator), set up a TOTP token for your mobile device.</li>
            </ol>
        </p>
        <h2>Initial Purify Setup</h2>
        <p>Initial setup for Purify is easy. Within minutes of Purify account creation, you should see all of your AWS accounts populate on the Accounts page. Click the on/off toggle to enable those accounts you would like to scan.</p>
        <p>Visit the Settings page to enable global notifications. Any email address listed in Global Notifications will receive all emails for any new violation of Purify rules. Use sparingly.</p>
        <p>Your next step is to visit the Rules page. From there, you can begin selecting rules to enable. Configure your individual rules with email addresses to receive notifications for each rule.</p>
    </div>
)

export default GettingStarted;