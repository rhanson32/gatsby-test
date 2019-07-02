import React from 'react';

const Works = () => (
    <div className="docs-section">
        <h1>How It Works</h1>
        <h2>New Accounts</h2>
        <p>As soon as a new account is created, the following actions occur immediately:</p>
        <ul>
            <li>New user groups for Administrators and Auditors are created within our identity management system. This keeps your users isolated from other users and prevents other users from seeing your data.</li>
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

export default Works;