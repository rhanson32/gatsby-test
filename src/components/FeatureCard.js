import React from 'react';

const FeatureCard = (props) => (
    <div className='feature-card'>
        <div className="feature-focus-image">
            <img src={props.image} alt={props.title} />
        </div>
        <div className="feature-focus-header">
            {props.title}
        </div>
        <div className="feature-focus-description">
            {props.description}
        </div>
    </div>
);

export default FeatureCard;