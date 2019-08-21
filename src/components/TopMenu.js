import React from 'react';
import { Nav } from 'tabler-react';
import { navigate } from '@reach/router';

const TopMenu = () => (
    <div className="navigation-wrapper" style={{ margin: "0", borderBottom: "1px solid #dee2e6", width: "100%", backgroundColor: "white", fontSize: "1rem" }}>
        <Nav className="navigation">
            <Nav.Item icon="globe" onClick={() => navigate('/app/dashboard')}>Dashboard</Nav.Item>
            <Nav.Item icon="list" onClick={() => navigate('/app/rules')}>Rules</Nav.Item>
            <Nav.Item icon="grid" onClick={() => navigate('/app/accounts')}>Accounts</Nav.Item>
            <Nav.Item icon="user" onClick={() => navigate('/app/users')}>Users</Nav.Item>
            <Nav.Item icon="settings" onClick={() => navigate('/app/settings')}>Settings</Nav.Item>
            <Nav.Item icon="help-circle" onClick={() => navigate('/app/support')}>Support</Nav.Item>
            <Nav.Item icon="activity" onClick={() => navigate('/app/history')}>Audit Trail</Nav.Item>
        </Nav>
    </div>
)

export default TopMenu;