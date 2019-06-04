import React from 'react';
import { Link } from 'gatsby';

class ActionCall extends React.Component {

    render() {
        return (
            <div className="action-call">
                <div className="action-header">
                    Try Purify for free
                </div>
                <Link className="action-button" to="/app/signup">
                    Sign up
                </Link>
            </div>
        )
    }
}

export default ActionCall;