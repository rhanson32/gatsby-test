import React from 'react';
import { Link } from 'gatsby';
const ExternalHeader = () => (
    <div className="header">
        <div className="header-title">
            Audit Cloud
        </div>
        <div className="header-menu">
            <Link activeClassName="active-link" to="/features/">Features</Link>
            <Link activeClassName="active-link" to="/">Home</Link>
            <Link activeClassName="active-link" to="/accounts/">Pricing</Link>
        </div>  
    </div>
);

export default ExternalHeader;