import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router'
import { Button } from 'antd';
import { postHistory } from '../actions';
import { logout, isLoggedIn } from "../utils/auth"
import { Auth } from 'aws-amplify';
import { Avatar } from 'tabler-react';
import logo from '../../static/PurifyWhiteLogo_2.png';


class Header extends React.Component {

    signOut = () => {
        this.props.postHistory({ Event: 'Logout', EventData: { User: { S: this.props.user.email } } }).catch(err => console.log(err));
        Auth.signOut().then(logout(() => navigate('/app/login'))).catch(err => console.log('error:', err))
    }

    render() {
        return (
            <div className="purify-header" autoscroll="true">
                <div className="header-title">
                    <img src={logo} height="55" alt="Purify Cloud Logo" />
                </div>
                <div className="header-menu">
                    <div className="user-name">
                        {this.props.user.email && (
                            <div className="purify-avatar" style={{ paddingTop: "0.3rem" }}>
                                <Avatar color="cyan" size="lg" icon="user" />
                            </div>
                        )}
                        
                        <div className="header-user">
                            <div className="header-user-name">
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
                                onClick={this.signOut}
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

export default connect(mapStateToProps, { postHistory })(Header);