import React from 'react';
import { Link } from 'gatsby';
const Header = () => (
    <div className="header">
        <div className="header-title">
            Audit Cloud
        </div>
        <div className="header-menu">
            <Link activeClassName="active-link" to="/rules/">Rules</Link>
            <Link activeClassName="active-link" to="/">Home</Link>
            <Link activeClassName="active-link" to="/accounts/">Accounts</Link>
        </div>  
    </div>
);

export default Header;