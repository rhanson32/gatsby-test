import React from 'react';

const Splash = (props) => (
    <div className={props.mobileMenu ? "splash mobile-menu-showing" : "splash mobile-menu-hidden"}>
        <div className="splash-overlay">
            <h2 className="splash-subtitle">Keep your entire cloud pristine. <br />Automatically. <br />With Purify.</h2>
        </div>
    </div>
);

export default Splash;