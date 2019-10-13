import React from 'react';
import { connect } from 'react-redux';
import DocsMenu from './DocsMenu';
import ExternalHeader from './ExternalHeader';
import GettingStarted from './GettingStarted';
import Prerequisites from './Prerequisites';
import SigningUp from './SigningUp';
import AddingUsers from './AddingUsers';
import Works from './Works';
import Footer from './Footer';

class Docs extends React.Component {
    state = {
        currentView: 'GettingStarted'
    }

    render() {
        return (
            <div className="docs-page">
                <ExternalHeader />
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
                    {
                        this.props.documentation === 'AddingUsers' && <AddingUsers />
                    }
                    {
                        this.props.documentation === 'HowItWorks' && <Works />
                    }
                </div>
                <Footer />
                
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