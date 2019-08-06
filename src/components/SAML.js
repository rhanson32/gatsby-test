import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { getToken } from '../actions';
import { Auth } from 'aws-amplify';

class SAML extends React.Component {

    state = {
        test: 'test'
    }

    componentDidMount = async () => {
        console.log(this.props);
        let pairs = window.location.search.slice(1).split('&');

        let result = {};
        let token;
        pairs.forEach(pair => {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });

        if(result.client_id && result.code)
        {
            token = await this.props.getToken(result);
            console.log(token);
            if(token)
            {
                localStorage.setItem('SSO-user', token.data.email);
                localStorage.setItem('SSO-sub', token.data.sub);
            }
        }
    }

    render() {
        console.log(this.state);
        return (
            <div>
                Retrieving credentials from Cognito...
            </div>
        )
    }
}

export default connect(null, { getToken })(SAML);