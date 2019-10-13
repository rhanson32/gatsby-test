import React from 'react';

const GettingStarted = () => (
    <div className="docs-section">
        <h1>Getting Started</h1>
        <h2>Initial Purify Setup</h2>
        <ol>
            <li>Sign up for a free Purify account.</li>
            <li>Sign into Purify and download PurifyController CloudFormation template. Take note of your company's unique ExternalID on the Settings page.</li>
            <li>Deploy the PurifyController CloudFormation template in your AWS master account, adding the External ID from the previous step as a paramter in the template.</li>
            <li>Complete the <a target="_blank" href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs.html">Prerequisites for CloudFormation Stack Set admin and execution roles.</a> If you already have these roles in your account, you may skip this step.</li>
            <li>Enter your AWS master account number on the Accounts page.</li>
            <li>Wait about 15 minutes for full automated setup to complete.</li>
            <li>Begin configuring Purify to your organization's standards.</li>
        </ol>
        <h2>Setting Up MFA on your main account</h2>
        <p>The account you use to sign up to Purify is your default administrator account. We recommend that you set up Multi-Factor Authentication on this account immediately to prevent unauthorized use of this account.</p>
        <p>To set up MFA on your main Purify account, log in to Purify using the main account, then:
            <ol>
                <li>Visit the Settings page.</li>
                <li>Select 'Enable MFA' on the General tab.</li>
                <li>Using any authenticator app that supports QR codes (e.g. Google Authenticator), set up a TOTP token for your mobile device.</li>
            </ol>
        </p>
        
    </div>
)

export default GettingStarted;