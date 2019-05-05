import React from 'react';

const FeatureItem = (props) => (
    <div className="feature-item">
        <div>
            Feature Icon
        </div>
        <div className="feature-item-header">
            {props.title}
        </div>
        <div>
            Feature description
        </div>
    </div>
);

export default FeatureItem;