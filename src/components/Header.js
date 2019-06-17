import React from 'react';
import { Link } from 'gatsby';

import { navigate } from '@reach/router'
import { Icon } from 'antd';
import { logout, isLoggedIn } from "../utils/auth"
import { Auth } from 'aws-amplify'


const Header = () => (
    <div className="header">
        <div className="header-title">
            Purify Cloud
        </div>
        <div className="header-menu">
            <Link activeClassName="active-link" to="/app/rules">Rules</Link>
            <Link activeClassName="active-link" to="/app/dashboard">Dashboard</Link>
            <Link activeClassName="active-link" to="/app/accounts">Accounts</Link>
            <Link activeClassName="active-link" to="/app/users">Users</Link>
            <Link activeClassName="active-link" to="/app/settings">Settings</Link>
            <Link activeClassName="active-link" to="/app/support">Support</Link>
            <div><Icon type="user" /></div>
            {
                isLoggedIn() && (
                    <div
                      onClick={
                      () => Auth.signOut().then(logout(() => navigate('/app/login'))).catch(err => console.log('error:', err))
                      }
                    >Sign Out</div>
                )
            }
        </div>  
    </div>
);

export default Header;