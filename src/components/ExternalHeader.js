import React from 'react';
import { Link } from 'gatsby';
const ExternalHeader = () => (
    <div className="external-header">
        <div className="external-title">
            
            <Link activeClassName="active-link" to="/">Purify Cloud</Link>
        </div>
        <div className="external-menu">
            <Link activeClassName="active-link" to="/features/">Why Purify?</Link>
            <Link activeClassName="active-link" to="/pricing/">Pricing</Link>
        </div>  
    </div>
);

export default ExternalHeader;