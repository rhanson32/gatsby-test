import React from 'react';
import { Link } from 'gatsby'

const SiteMap = () => (
    <div className="site-map">
        <div className="site-map-logo">
        <Link to="/">PurifyCloud</Link>
        </div>
        <div className="site-map-item">
            <div className="site-map-item-header">
                Product
            </div>
            <div className="site-map-item-link">
                <Link to="/app/features">Why Purify</Link>
            </div>
            <div className="site-map-item-link">
                <Link to="/app/pricing">Pricing</Link>
            </div>
        </div>
        <div className="site-map-item">
            <div className="site-map-item-header">
                Resources
            </div>
            <div className="site-map-item-link">
                <Link to="/app/docs">Docs</Link>
            </div>
            <div className="site-map-item-link">
                &nbsp;
            </div>
        </div>
        <div className="site-map-item">
            <div className="site-map-item-header">
                Company
            </div>
            <div className="site-map-item-link">
                About Us
            </div>
            <div className="site-map-item-link">
                &nbsp;
            </div>
        </div>
    </div>
);

export default SiteMap;