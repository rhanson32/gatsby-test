import React from "react";

import App from '../components/App';
import { Helmet } from 'react-helmet';
import Amplify from 'aws-amplify';
const AWS = require('aws-sdk');

// set the default config object
var creds = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:593d52ae-0e06-4627-acde-2f77873aae2c'
});
AWS.config.credentials = creds;

Amplify.configure({
    Auth: {  
        region: 'us-east-1',
        userPoolId: 'us-east-1_wMiZuxWyI',
        userPoolWebClientId: '460d418243ki5gtsqebnsbt1na',
        identityPoolId: 'us-east-1:593d52ae-0e06-4627-acde-2f77873aae2c'
    },
    Storage: {
        AWSS3: {
            bucket: 'purify-metadata',
            region: 'us-east-1'
        }
    }
});


const IndexPage = () => (
    <App>
        <Helmet title="Clean up your cloud">
            <title>Clean up your cloud</title>
        </Helmet>
    </App>
)

export default IndexPage;