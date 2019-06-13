import React from 'react';

const SigningUp = () => (
    <div className="docs-section">
        <h1>How to Sign Up</h1>
        <h2>New Accounts</h2>
        <p> Signing up requires only an email, password and company name. Company name is used to create unique user groups so that your data is only viewable by your users. To sign up, follow the steps below:</p>
        <ol>
            <li>Click the Sign Up button above.</li>
            <li>Enter the required information and submit.</li>
            <li>A confirmation code will be sent to your email. Enter it in the next screen.</li>
            <li>Once redirected, log in with your new credentials.</li>
        </ol>

        <h2>Upgrading Your Subscription</h2>
        <p>
            Initial sign ups default to the Free subscription. To enable additional features, you may upgrade to the Standard subscription by:
        </p>
        <ol>
            <li>Visiting the Settings page.</li>
            <li>Under the General tab, select 'Upgrade my account'.</li>
            <li>Select the new plan that you would like.</li>
            <li>Once redirected to the payments page, enter payment information.</li>
            <li>Click Submit.</li>
        </ol>
    </div>
)

export default SigningUp;