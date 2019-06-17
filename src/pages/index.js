import React from "react";

import App from '../components/App';
import { Helmet } from 'react-helmet';
import Amplify from 'aws-amplify';

Amplify.configure({
    Auth: {
        
        // REQUIRED - Amazon Cognito Region
        region: 'us-east-1',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-east-1_wMiZuxWyI',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '1ng8vh5ghq0jmjfcecloklp5jb'
    }
});


const IndexPage = () => (
    <div>
        <App>
            <Helmet>
                <title>Clean up your cloud</title>
            </Helmet>
        </App>
    </div>
)

export default IndexPage;