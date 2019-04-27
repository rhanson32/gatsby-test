import React from 'react';
import { Link } from 'gatsby';
const Header = () => (
    <div className="header">
        <div className="header-title">
            Audit Cloud
        </div>
        <div className="header-menu">
            <Link to="/rules/">Rules</Link>
            <Link to="/">Home</Link>
            <Link to="/accounts/">Accounts</Link>
        </div>  
    </div>
);

export default Header;