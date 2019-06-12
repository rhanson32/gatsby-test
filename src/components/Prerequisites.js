import React from 'react';

const Prerequisites = () => (
    <div className="docs-section">
        <h1>Prerequisites</h1>
        <h2>Accounts and Permissions</h2>
        <p>In order to maximize the value of Purify, you should make sure you have the following in hand before signing up:</p>
        <ul>
            <li>An AWS master account, as identified in AWS Organizations</li>
            <li>An IAM role configured in the AWS master account</li>
        </ul>
        <p>
            The IAM role must have a minimum set of permissions for Purify and trust the Purify main AWS account so that Purify can assume the role. An example trust policy is here, and a sample IAM permissions policy is here.
        </p>
        <h3>Key Permissions (non-exhaustive)</h3>
        <ul>
            <li>CreateStackSet: Purify uses AWS' StackSets feature to deploy IAM roles across all accounts in your organization. Scanning activities will not work without this permission.</li>
            <li>UpdateStackSet: To maintain and enhance capabilities in all accounts as Purify evolves</li>
            <li>ListOrganizations: For Purify to discover all AWS accounts within your organization</li>
        </ul>
        <h2>Notifications</h2>
        <p>To receive alerts for policy violations and other communications from Purify, please whitelist notifications [at] purify [dot] cloud in your corporate email protection software.</p>
    </div>
)

export default Prerequisites;