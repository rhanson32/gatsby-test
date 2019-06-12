import React from 'react';
import { connect } from 'react-redux';
import DocsMenu from './DocsMenu';
import ExternalHeader from './ExternalHeader';
import GettingStarted from './GettingStarted';
import MobileMenu from './MobileMenu';
import Prerequisites from './Prerequisites';
import SigningUp from './SigningUp';

class Docs extends React.Component {
    state = {
        currentView: 'GettingStarted'
    }

    render() {
        return (
            <div>
                <ExternalHeader />
                {this.props.mobile.mobileMenu && <MobileMenu />}
                <div className="docs-main">
                    <DocsMenu />
                    {
                        this.props.documentation === 'GettingStarted' && <GettingStarted />
                    }
                    {
                        this.props.documentation === 'Prerequisites' && <Prerequisites />
                    }
                    {
                        this.props.documentation === 'SigningUp' && <SigningUp />
                    }
                    
                </div>
                
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        mobile: state.mobile,
        documentation: state.documentation
    }
}

export default connect(mapStateToProps, null)(Docs);