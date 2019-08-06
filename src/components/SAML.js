import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { getToken } from '../actions';

class SAML extends React.Component {

    state = {
        test: 'test'
    }

    componentDidMount = () => {
        console.log(this.props);
        let pairs = location.search.slice(1).split('&');

        let result = {};
        pairs.forEach(pair => {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });
        console.log(result);

        if(result.code && result.client_id)
        {
            this.props.getToken(result);
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