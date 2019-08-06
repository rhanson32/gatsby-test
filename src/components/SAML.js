import React from 'react';
import { navigate } from '@reach/router';

class SAML extends React.Component {

    state = {
        test: 'test'
    }

    componentDidMount = () => {
        console.log(this.props);
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