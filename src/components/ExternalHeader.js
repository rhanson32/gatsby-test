import React from 'react';
import { Link } from 'gatsby';
const ExternalHeader = () => (
    <div className="external-header">
        <div className="external-title">
            <Link activeClassName="active-link" to="/">PurifyCloud</Link>
        </div>
        <div className="external-menu">
            <Link activeClassName="active-link" to="/app/features/">Why Purify?</Link>
            <Link activeClassName="active-link" to="/app/pricing/">Pricing</Link>      
        </div>  
        <div className="right-menu">
            <Link className="login-link" to="/app/login">Log In</Link>
            <Link className="sign-up-link" to="/app/signup">Sign Up</Link>
        </div>
    </div>
);

export default ExternalHeader;