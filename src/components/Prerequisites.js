import React from 'react';

const Prerequisites = () => (
    <div className="docs-section">
        <h1>Prerequisites</h1>
        <h2>Accounts and Permissions</h2>
        <p>Before signing up for a Purify account, verify that you have access to your AWS master account with sufficient permissions to deploy a CloudFormation template.</p>

        <p>
            To simplify the deployment of necessary permissions for Purify to work, we provide a CloudFormation template with the necessary permissions inside the Purify application. Upon first login, you will be given the opportunity to download this template for your use.
        </p>
        <p>
        If you cannot locate this template, please email support [at] purify [dot] cloud from the email address used to create your Purify account and we will provide a direct link.
        </p>
        <h3>Key Permissions (non-exhaustive)</h3>
        <ul>
            <li>CreateStackSet: Required for initial deployment into each account. The Purify architecture is outlined in 'How it Works'.</li>
            <li>UpdateStackSet: To maintain and enhance capabilities in all accounts as the Purify feature set evolves</li>
            <li>DeleteStackSet: Simplifies removal of Purify if you cancel your account.</li>
            <li>DeleteStackInstances: Removes individual stacks from specific accounts upon cancellation.</li>
        </ul>
        <h2>Notifications</h2>
        <p>To receive alerts for policy violations and other communications from Purify, please whitelist notifications [at] purify [dot] cloud in your corporate email protection software.</p>
    </div>
)

export default Prerequisites;