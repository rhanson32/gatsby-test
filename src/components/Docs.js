import React from 'react';
import DocsMenu from './DocsMenu';
import ExternalHeader from './ExternalHeader';

class Docs extends React.Component {

    render() {
        return (
            <div>
                <ExternalHeader />
                <div className="docs-main">
                    <DocsMenu />
                    <div className="docs-content">
                        This is some content that I want to display
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Docs;