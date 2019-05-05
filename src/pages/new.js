import React from 'react';

import ExternalHeader from '../components/ExternalHeader';
import CreateAccount from '../components/CreateAccount';

class New extends React.Component {

    render() {
        return (
            <div>
                <ExternalHeader />
                <CreateAccount />
            </div>
        )
    }
}

export default New;