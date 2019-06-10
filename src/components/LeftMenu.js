import React from 'react';
import { Link } from '@reach/router';
import { IoMdSettings, IoMdAnalytics, IoMdApps, IoMdCheckboxOutline } from 'react-icons/io';

const LeftMenu = () => (
    <div className="left-menu">
        <div className="left-menu-item">
            <Link to="/app/dashboard">
                <IoMdAnalytics size="75%" />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/rules">
                <IoMdCheckboxOutline size="75%" />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/accounts">
                <IoMdApps size="75%" />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/settings">
                <IoMdSettings size="75%" />
            </Link>
        </div>
    </div>
);

export default LeftMenu;