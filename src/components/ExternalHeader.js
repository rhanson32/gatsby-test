import React from 'react';
import { Link } from 'gatsby';
import MobileMenu from './MobileMenu';
class ExternalHeader extends React.Component {
    state = {
        mobileVisible: false
    }

    toggleMobile = () => {
        this.setState({
            mobileVisible: !this.state.mobileVisible
        })
    }
    render() {
        return (
            <div className="external-header">
                <div className="external-title">
                    <button className="mobile-menu-button" onClick={this.toggleMobile}>
                        Mobile
                    </button>
                    <Link activeClassName="active-link" to="/">PurifyCloud</Link>
                </div>
                <div className="external-menu">
                    <Link activeClassName="active-link" to="/app/features">Why Purify?</Link>
                    <Link activeClassName="active-link" to="/app/pricing">Pricing</Link> 
                    <Link activeClassName="active-link" to="/app/docs">Docs</Link>       
                </div>  
                <div className="right-menu">
                    <Link className="login-link" to="/app/login">Log In</Link>
                    <Link className="sign-up-link" to="/app/signup">Sign Up</Link>
                </div>
                <MobileMenu />
            </div>
        )
    }
}

export default ExternalHeader;