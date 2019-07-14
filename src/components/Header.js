import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router'
import { Icon, Button } from 'antd';
import { logout, isLoggedIn } from "../utils/auth"
import { Auth } from 'aws-amplify';


class Header extends React.Component {

    render() {
    
        return (
            <div className="header" autoscroll="true">
                <div className="header-title">
                    Purify Cloud
                </div>
                <div className="header-menu">
                    <div className="user-name">
                        {this.props.user.email && <Icon type="user" />}
                        {this.props.user && this.props.user.email ? ' ' + this.props.user.email : ' '}
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