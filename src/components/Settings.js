import React from 'react'
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { getExpiration } from '../utils/auth';
import TabsCard from './TabsCard';
import { getSettings, toggleAWS, getAccounts, getCurrentUser } from '../actions';
import TopMenu from './TopMenu';
import Header from './Header';
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
        showKey: false,
        scanComplete: false,
        accountsError: ``
    };

    componentDidMount = async () => {
        if(moment(getExpiration()) < moment())
        {
            console.log("User session has expired");
            message.warning('Your session has expired. Redirecting to login page in 2 seconds.');
            if(this.props.user.type !== 'federated')
            {
                setTimeout(async () => {
                    await Auth.signOut();
                    navigate('/app/login');
                }, 2000); 
            }
            else
            {
                setTimeout(async () => {
                    navigate('/app/login');
                }, 2000); 
            }
        }

        if(!this.props.user.email)
        {
            await this.props.getCurrentUser()
        }
        let accountsResponse = await this.props.getAccounts(this.props.user.CustomerId);
        let settingsResponse = await this.props.getSettings(this.props.user.CustomerId);
        console.log("Settings Response:", settingsResponse);
        if(accountsResponse.statusCode !== 200)
        {
            this.setState({ accountsError: accountsResponse.error });
            message.error(accountsResponse.error);
        }
        this.setState({
            scanComplete: true
        })
    }

    toggleAWSState = () => {
        this.props.toggleAWS();
    }

    showKey = () => {
        this.setState({
            showKey: !this.state.showKey
        })
    }

    render() {
    return (
    <div className="settings-page">
        <Header />
        <TopMenu />
        <div className="support-right-side">
            <div className="support-screen-header">
                    <h1>Settings</h1>
                </div>
            <div className="settings-main">
                <TabsCard accountsError={this.state.accountsError} scanComplete={this.state.scanComplete} />
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