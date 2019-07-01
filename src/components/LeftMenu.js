import React from 'react';
import { Link } from '@reach/router';
import { Icon } from 'antd';
import { IoMdSettings, IoMdAnalytics, IoMdApps, IoMdCheckboxOutline } from 'react-icons/io';

const LeftMenu = () => (
    <div className="left-menu">
        <div className="left-menu-item">
            <Link to="/app/dashboard">
                <Icon type="dashboard" style={{ fontSize: "2rem" }} />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/rules">
            <Icon type="check-square" style={{ fontSize: "2rem" }} />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/accounts">
            <Icon type="appstore" style={{ fontSize: "2rem" }} />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/settings">
                <Icon type="setting" style={{ fontSize: "2rem" }} />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/users">
                <Icon type="user" style={{ fontSize: "2rem" }} />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/support">
                <Icon type="question-circle" style={{ fontSize: "2rem" }} />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/history">
                <Icon type="history" style={{ fontSize: "2rem" }} />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/payment">
                <Icon type="history" style={{ fontSize: "2rem" }} />
            </Link>
        </div>
    </div>
);

export default LeftMenu;