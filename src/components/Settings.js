import React from 'react'
import { Header } from 'tabler-react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { isLoggedIn, getExpiration, logout } from '../utils/auth';
import TabsCard from './TabsCard';
import { getSettings, toggleAWS, getAccounts, getCurrentUser } from '../actions';
import { Icon, Button } from 'antd';
import TopMenu from './TopMenu';
import moment from 'moment';
import { message } from 'antd';

class Settings extends React.Component {

    state = {
        AccountHeader: {
            AccountId: 'Account ID',
            Provider: 'Provider',
            RoleName: 'Role Name',
            Header: true
        },
        AddAccount: false,
        Menu: 'General',
        showKey: false
    };

    componentDidMount = async () => {
        if(moment(getExpiration()) < moment())
        {
            console.log("User session has expired");
            message.warning('Your session has expired. Redirecting to login page in 2 seconds.');
            setTimeout(async () => {
                await Auth.signOut();
                navigate('/app/login');
            }, 2000); 
        }
        await this.props.getCurrentUser()
        this.props.getSettings()
        this.props.getAccounts(this.props.user.CustomerId)
    }

    toggleAWSState = () => {
        this.props.toggleAWS()
    }

    showKey = () => {
        this.setState({
            showKey: !this.state.showKey
        })
    }

    render() {
    return (
    <div className="settings-page">
        <Header.H2>
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
            <TopMenu />
        </Header.H2>
        <div className="support-right-side">
            <div className="support-screen-header">
                    <h1>Settings</h1>
                </div>
            <div className="settings-main">
                <TabsCard />
            </div>
        </div>
        
    </div>
    )
    }
}

const mapStateToProps = state => {
    return {
        menu: state.menu,
        settings: state.settings,
        accounts: state.accounts,
        user: state.user
    }
}

export default connect(mapStateToProps, { getSettings, toggleAWS, getAccounts, getCurrentUser })(Settings);