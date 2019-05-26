import React from 'react';
import { Link } from 'gatsby';

const GettingStarted = () => (
    <div>
        <h1>Getting Started</h1>
        <p>To get started, visit the <Link to="/app/signup">Sign Up</Link> page. Once you sign up, you will receive an authorization code by email. Enter the auth code and submit. You will be redirected to the Login page to log in.</p>
    </div>
)

export default GettingStarted;