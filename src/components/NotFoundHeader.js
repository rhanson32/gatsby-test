import React from 'react';

class NotFoundHeader extends React.Component {

    render() {
    
        return (
            <div className="purify-header" autoscroll="true">
                <div className="header-title">
                    Purify Cloud
                </div>
                <div className="header-menu">
                    <div className="user-name">
                        <div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", padding: "0 0.5rem" }}>
                        </div>
                    </div>
                </div>  
            </div>
        )
    }
}

export default NotFoundHeader;