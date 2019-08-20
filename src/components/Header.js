import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router'
import { Button } from 'antd';
import { logout, isLoggedIn } from "../utils/auth"
import { Auth } from 'aws-amplify';
import { Avatar, Icon } from 'tabler-react';
import logo from '../../static/PurifyWhiteLogo_1.png';


class Header extends React.Component {

    render() {
        return (
            <div className="purify-header" autoscroll="true">
                <div className="header-title">
                    <img src={logo} height="55" />
                </div>
                <div className="header-menu">
                    <div className="user-name">
                        {this.props.user.email && (
                            <div style={{ paddingTop: "0.3rem" }}>
                                <Avatar color="cyan" size="lg" icon="user" />
                            </div>
                        )}
                        
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", padding: "0 0.5rem 1rem 0.5rem" }}>
                            <div style={{ fontSize: "20px", maxHeight: "24px", display: "flex", alignItems: "flex-start" }}>
                                {this.props.user && this.props.user.email ? ' ' + this.props.user.email : ' '}
                            </div>
                            {this.props.user.email && (
                                <div style={{ fontSize: "16px", maxHeight: "16px" }}>
                                    {this.props.user && this.props.user.Group && this.props.user.Group.includes('Administrator') ? 'Administrator' : 'Auditor'}
                                </div>
                            )}
                        </div>
                        
                    </div>
                    {
                        isLoggedIn() && this.props.user.email && (
                            <Button
                                type="default"
                                onClick={() => Auth.signOut().then(logout(() => navigate('/app/login'))).catch(err => console.log('error:', err))}
                            >
                                Sign Out &nbsp; <Icon name="log-out" />
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