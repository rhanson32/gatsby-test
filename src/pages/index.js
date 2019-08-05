import React from "react";

import App from '../components/App';
import { Helmet } from 'react-helmet';
import Amplify from 'aws-amplify';

Amplify.configure({
    Auth: {  
        region: 'us-east-1',
        userPoolId: 'us-east-1_wMiZuxWyI',
        userPoolWebClientId: '1ng8vh5ghq0jmjfcecloklp5jb',
        identityPoolId: 'us-east-1:593d52ae-0e06-4627-acde-2f77873aae2c'
    }
});


const IndexPage = () => (
    <App>
        <Helmet>
            <title>Clean up your cloud</title>
        </Helmet>
    </App>
)

export default IndexPage;