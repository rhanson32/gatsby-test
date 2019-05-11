import React from 'react';


const FeatureFocus = (props) => (
    <div className="feature-focus">
    <div className="feature-focus-header">
        {props.title}
    </div>
    <div className="feature-focus-description">
        {props.description}
    </div>
    </div>
);

export default FeatureFocus;