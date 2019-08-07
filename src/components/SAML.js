import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { getToken, addDefaultGroup } from '../actions';
import moment from 'moment';

class SAML extends React.Component {

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
                localStorage.setItem('purifyUser', JSON.stringify({
                    username: token.data.email,
                    expiration: moment().add(12, 'hours').toISOString(),
                    type: 'federated',
                    client: token.data.aud
                }));
                this.props.addDefaultGroup(token.data.Identities[0].providerName);
                navigate('/app/dashboard');
            }
            else
            {
                navigate('/app/login');
            }
        }
    }

    render() {
        return (
            <div className="saml-message">
                Retrieving application credentials...
            </div>
        )
    }
}

export default connect(null, { getToken, addDefaultGroup })(SAML);