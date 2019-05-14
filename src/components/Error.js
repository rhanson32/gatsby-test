
//https://github.com/wesbos/dump
import React from 'react';

const Error = props => (
    <div className="error-item">
        <pre>
            {props.errorMessage.message}
        </pre>
    </div>
);

export default Error;