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
            <a onClick={this.showWorks}>
                How It Works
            </a>
        </div>
        <div className="docs-menu-item">
            <a onClick={this.showPrerequisites}>
                Prerequisites
            </a>
        </div>
        <div className="docs-menu-item">
            <a onClick={this.showSigningUp}>
                Signing Up
            </a>
            
        </div>
        <div className="docs-menu-header">
            One-Time Setup
        </div>
        <div className="docs-menu-item">
            <a onClick={this.showAddingUsers}>
                Adding Users
            </a>
        </div>
        <div className="docs-menu-item">
            <a onClick={this.showGettingStarted}>
                Getting Started
            </a>
            
        </div>
        <div className="docs-menu-item">
            Configuring Purify
        </div>
        <div className="docs-menu-item">
            Automated Remediation
        </div>
        <div className="docs-menu-header">
            Advanced Configuration
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