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

    render() {

        return (
    <div className="docs-menu">
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
        <div className="docs-menu-item">
            Confirmations
        </div>
        <div className="docs-menu-item">
            Adding Users
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