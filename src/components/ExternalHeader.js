import React from 'react';
import { Link } from 'gatsby';
const ExternalHeader = () => (
    <div className="external-header">
        <div className="external-title">
            Purify Cloud
        </div>
        <div className="external-menu">
            <Link activeClassName="active-link" to="/features/">Why Purify?</Link>
            <Link activeClassName="active-link" to="/">Home</Link>
            <Link activeClassName="active-link" to="/accounts/">Pricing</Link>
        </div>  
    </div>
);

export default ExternalHeader;