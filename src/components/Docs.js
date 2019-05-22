import React from 'react';
import DocsMenu from './DocsMenu';
import ExternalHeader from './ExternalHeader';

class Docs extends React.Component {

    render() {
        return (
            <div>
                <ExternalHeader />
                <DocsMenu />
                <div>
                    Test text
                </div>
            </div>
        )
    }
}

export default Docs;