import React from 'react';
import { Link } from '@reach/router';
import { Icon } from 'antd';

const LeftMenu = () => (
    <div className="left-menu">
        <div className="left-menu-item">
            <Link to="/app/dashboard">
                <Icon type="dashboard" theme="twoTone" twoToneColor="#0984e3" style={{ fontSize: "2rem" }} />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/rules">
            <Icon type="check-square" theme="twoTone" twoToneColor="#0984e3" style={{ fontSize: "2rem" }} />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/accounts">
            <Icon type="appstore" theme="twoTone" twoToneColor="#0984e3" style={{ fontSize: "2rem" }} />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/settings">
                <Icon type="setting" theme="twoTone" twoToneColor="#0984e3" style={{ fontSize: "2rem" }} />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/users">
                <Icon type="user"  style={{ fontSize: "2rem", color: "#0984e3" }} />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/support">
                <Icon type="question-circle" theme="twoTone" twoToneColor="#0984e3" style={{ fontSize: "2rem" }} />
            </Link>
        </div>
        <div className="left-menu-item">
            <Link to="/app/history">
                <Icon type="history" style={{ fontSize: "2rem", color: "#0984e3" }} />
            </Link>
        </div>
    </div>
);

export default LeftMenu;