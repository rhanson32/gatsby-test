import React from 'react';
import master from '../../static/MasterAccountDeployment.svg';

import child from '../../static/MasterAccountStackSet.svg';

const Works = () => (
    <div className="docs-section">
        <h1>How It Works</h1>
        <h2>Architecture</h2>
        <p>Our architecture is designed to evaluate your entire environment with the lightest footprint and simplest setup possible. We do this by deploying CloudFormation templates into your AWS account which will let us access each of your accounts to evaluate your resources against the rules that you have configured in your Purify account.</p>
        <p>Two templates will be deployed into your AWS estate. The first is your responsibility and enables us to deploy and manage the second template.</p>
        <h3>Your Responsibility</h3>
        <p>The first template is a CloudFormation stack, consisting of an IAM role and an inline policy for that role. This role will be used to deploy a CloudFormation Stack Set in each account for evaluation and management of resources across your estate.</p>
        <p>Here is a diagram of how your AWS master account will look after deploying our Master Account CloudFormation template:</p>
        <div className="docs-architecture">
            <img src={master} />
        </div>
        <p>The role which is created is called PurifyController.</p>
        <h3>Our Responsibility</h3>
        <p>The newly provisioned PurifyController IAM role will automatically deploy a CloudFormation Stack Set with Stack Instances in each AWS account in the same organization. As part of the stack set, each AWS account will receive a new role called PurifyManager. This role will execute the majority of the activities Purify runs against your accounts.</p>
        <div className="docs-architecture">
            <img src={child} />
        </div>
        <p>We use this stack set to update the permissions of the PurifyManager account as we release new features and support additional AWS services.</p>
        <p>We also will deploy this Stack Set into new AWS accounts as we discover them.</p>
        <h2>New Accounts</h2>
        <p>As soon as a new Purify account is created, the following actions occur immediately:</p>
        <ul>
            <li>New user groups for Administrators and Auditors are created within our identity management system. This keeps your users isolated from other users and prevents other users from seeing your data.</li>
            <li>The user who created the Purify account is automatically placed in the Administrators group.</li>
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