import React from 'react';
import { Link } from 'gatsby';
import { connect } from 'react-redux';
import { showMobile } from '../actions';
import logo3 from '../../static/PurifyWhiteLogo_2.png';

class MobileMenu extends React.Component {

    toggleMobile = () => {
        this.props.showMobile()
    }

    render() {
        return (
            <div className="mobile-menu">
                <img src={logo3} alt="Purify Cloud Logo" />
                <Link activeClassName="active-link" to="/app/features" onClick={this.toggleMobile}>Why Purify?</Link>
                <Link activeClassName="active-link" to="/app/pricing" onClick={this.toggleMobile}>Pricing</Link> 
                <Link activeClassName="active-link" to="/app/docs" onClick={this.toggleMobile}>Docs</Link>  
                <Link className="login-link" to="/app/login" onClick={this.toggleMobile}>Log In</Link>
                <Link className="sign-up-link" to="/app/signup" onClick={this.toggleMobile}>Sign Up</Link>
            </div>
        )
    }
}

export default connect(null, { showMobile })(MobileMenu);