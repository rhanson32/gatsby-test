import React from 'react';
import { navigate } from '@reach/router';

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
    }

    render() {
        console.log(this.state);
        return (
            <div>
                Hello World! sfwdhfudhfsfsdfjsdk
            </div>
        )
    }
}

export default SAML;