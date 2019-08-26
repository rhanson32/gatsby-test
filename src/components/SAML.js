import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { setExpiration } from '../utils/auth'
import { getToken, addDefaultGroup } from '../actions';
import moment from 'moment';

class SAML extends React.Component {

    state = {
        error: ``
    }

    componentDidMount = async () => {
        console.log(this.props);
        setExpiration(moment().add(12, 'hours').toISOString());
        let pairs = window.location.search.slice(1).split('&');
        console.log(pairs);
        let result = {};
        let token;
        pairs.forEach(pair => {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });
        console.log(result);

        if(result.client_id && result.code)
        {
            token = await this.props.getToken(result);
            console.log(token);
            if(token)
            {
                console.log(token);
                localStorage.setItem('purifyUser', JSON.stringify({
                    username: token.data.email,
                    expiration: moment().add(12, 'hours').toISOString(),
                    type: 'federated',
                    client: token.data.aud
                }));
                
                if(token.data["cognito:groups"].length === 1 && token.data["cognito:groups"].find(group => group.includes('SSO')))
                {
                    await this.props.addDefaultGroup(token.data);
                }
                
                navigate('/app/dashboard');
            }
            else
            {
                navigate('/app/login');
            }
        }
        else
        {
            this.setState({
                error: 'Unable to validate user with Identity Provider. Please check your provider settings and try again.'
            });
            navigate('/app/login');
        }
    }

    render() {
        return (
            <div className="saml-message">
                {this.state.error === `` && "Retrieving application credentials..."}
                <div>
                    {this.state.error}
                </div>
            </div>
        )
    }
}

export default connect(null, { getToken, addDefaultGroup })(SAML);