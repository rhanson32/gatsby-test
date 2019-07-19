import React from 'react';
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
                <Button size="large" className="green-icon" onClick={this.navigateSignUp}>
                    Sign Up
                </Button>
            </div>
        )
    }
}

export default ActionCall;