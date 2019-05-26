import React from 'react';
import { Link } from 'gatsby';

const MobileMenu = () => (
    <div className="mobile-menu">
        <Link activeClassName="active-link" to="/app/features">Why Purify?</Link>
        <Link activeClassName="active-link" to="/app/pricing">Pricing</Link> 
        <Link activeClassName="active-link" to="/app/docs">Docs</Link>  
        <Link className="login-link" to="/app/login">Log In</Link>
        <Link className="sign-up-link" to="/app/signup">Sign Up</Link>
    </div>
)

export default MobileMenu;