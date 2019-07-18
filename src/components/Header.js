import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router'
import { Icon, Button } from 'antd';
import { logout, isLoggedIn } from "../utils/auth"
import { Auth } from 'aws-amplify';
import { Avatar } from 'tabler-react';


class Header extends React.Component {

    render() {
    
        return (
            <div className="header" autoscroll="true">
                <div className="header-title">
                    Purify Cloud
                </div>
                <div className="header-menu">
                    <div className="user-name">
                        <Avatar size="lg" icon="users" />
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", padding: "0 0.5rem" }}>
                            <div style={{ fontSize: "20px", maxHeight: "24px", display: "flex", alignItems: "flex-start" }}>
                                {this.props.user && this.props.user.email ? ' ' + this.props.user.email : ' '}
                            </div>
                            <div style={{ fontSize: "16px", maxHeight: "16px" }}>
                                {this.props.user && this.props.user.Group && this.props.user.Group.includes('Administrator') ? ' ' + 'Administrator' : 'Auditor'}
                            </div>
                        </div>
                        
                    </div>
                    {
                        isLoggedIn() && this.props.user.email && (
                            <Button
                                type="default"
                                onClick={() => Auth.signOut().then(logout(() => navigate('/app/login'))).catch(err => console.log('error:', err))}
                            >
                                Sign Out
                            </Button>
                        )
                    }
                </div>  
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, null)(Header);