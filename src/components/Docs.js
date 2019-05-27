import React from 'react';
import { connect } from 'react-redux';
import DocsMenu from './DocsMenu';
import ExternalHeader from './ExternalHeader';
import GettingStarted from './GettingStarted';
import MobileMenu from './MobileMenu';

class Docs extends React.Component {

    render() {
        return (
            <div>
                <ExternalHeader />
                {this.props.mobile.mobileMenu && <MobileMenu />}
                <div className="docs-main">
                    <DocsMenu />
                    <GettingStarted />
                </div>
                
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        mobile: state.mobile
    }
}

export default connect(mapStateToProps, null)(Docs);