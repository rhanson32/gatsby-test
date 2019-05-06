import React from 'react';

const FeatureItem = (props) => (
    <div className="feature-item">
        <div>
            {props.icon || "yes"}
        </div>
        <div className="feature-item-header">
            {props.title}
        </div>
        <div>
            {props.description}
        </div>
    </div>
);

export default FeatureItem;