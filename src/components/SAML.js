import React from 'react';
import { navigate } from '@reach/router';

class SAML extends React.Component {

    state = {
        test: 'test'
    }

    render() {
        console.log(this.state);
        return (
            <div>
                Hello World! sfwdhfudhfsfsdfjsdk
                {this.props}
            </div>
        )
    }
}

export default SAML;