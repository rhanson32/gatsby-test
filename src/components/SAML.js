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
        let pairs = location.search.slice(1).split('&');

        let result = {};
        pairs.forEach(pair => {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });
        console.log(result);

        const user = await Auth.currentAuthenticatedUser();

        console.log(user);
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