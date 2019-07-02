import React from 'react';
import { Link } from 'gatsby';
import { navigate } from '@reach/router';
import { Button } from 'antd';

class ActionCall extends React.Component {

    navigateSignUp = () => {
        navigate('/app/signup');
    }

    render() {
        return (
            <div className="action-call">
                <div className="action-header">
                    Try Purify for free
                </div>
                <Button size="large" type="primary" onClick={this.navigateSignUp}>
                    Sign Up
                </Button>
            </div>
        )
    }
}

export default ActionCall;