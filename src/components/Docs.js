import React from 'react';
import DocsMenu from './DocsMenu';
import ExternalHeader from './ExternalHeader';
import GettingStarted from './GettingStarted';

class Docs extends React.Component {

    render() {
        return (
            <div>
                <ExternalHeader />
                <div className="docs-main">
                    <DocsMenu />
                    <GettingStarted />
                </div>
                
            </div>
        )
    }
}

export default Docs;