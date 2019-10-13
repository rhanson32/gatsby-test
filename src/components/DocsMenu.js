import React from 'react';
import { connect } from 'react-redux';
import { showDocumentation } from '../actions';

class DocsMenu extends React.Component {

    handleClick = (e) => {
        console.log(e);
    }

    showPrerequisites = () => {
        this.props.showDocumentation('Prerequisites');
    }

    showGettingStarted = () => {
        this.props.showDocumentation('GettingStarted');
    }

    showSigningUp = () => {
        this.props.showDocumentation('SigningUp');
    }

    showAddingUsers = () => {
        this.props.showDocumentation('AddingUsers');
    }

    showWorks = () => {
        this.props.showDocumentation('HowItWorks');
    }

    render() {

        return (
            <div className="docs-menu">
                <div className="docs-menu-header">
                    Where To Begin
                </div>
                <div className="docs-menu-item">
                    <button className="docs-menu-link" onClick={this.showWorks}>
                        How Purify Works
                    </button>
                </div>
                <div className="docs-menu-item">
                    <button className="docs-menu-link" onClick={this.showPrerequisites}>
                        Prerequisites
                    </button>
                </div>
                <div className="docs-menu-item">
                    <button className="docs-menu-link" onClick={this.showSigningUp}>
                        Signing Up
                    </button>
                    
                </div>
                <div className="docs-menu-header">
                    One-Time Setup
                </div>
                <div className="docs-menu-item">
                    <button className="docs-menu-link" onClick={this.showGettingStarted}>
                        Getting Started
                    </button>
                </div>
                <div className="docs-menu-item">
                    <button className="docs-menu-link" onClick={this.showAddingUsers}>
                        Adding Users
                    </button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        documentation: state.documentation
    }
}

export default connect(mapStateToProps, { showDocumentation })(DocsMenu);