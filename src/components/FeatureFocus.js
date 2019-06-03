import React from 'react';


const FeatureFocus = (props) => (
    <div className="feature-focus" style={{ backgroundColor: props.color }}>
        <div className="feature-focus-text">
            <div className="feature-focus-header">
                {props.title}
            </div>
            <div className="feature-focus-description">
                {props.description}
            </div>
        </div>
        <div className="feature-focus-image">
            <img src={props.image} alt={props.title} />
        </div>
    </div>
);

export default FeatureFocus;