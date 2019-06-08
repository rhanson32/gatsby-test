import React from 'react'
import Header from './Header'
import SettingsMenu from './SettingsMenu';
import AWSAccount from './AWSAccount';
import { connect } from 'react-redux'
import AccountItem from './AccountItem';
import AddAccount from './AddAccount';
import { getSettings, toggleAWS, getAccounts, getCurrentUser } from '../actions'

class Settings extends React.Component {

    state = {
        AccountHeader: {
            AccountId: 'Account ID',
            Provider: 'Provider',
            RoleName: 'Role Name',
            Header: true
        },
        AddAccount: false,
        Menu: 'General'
    };

    componentDidMount = async () => {
        await this.props.getCurrentUser()
        this.props.getSettings()
        this.props.getAccounts(this.props.user.CustomerId)
    }

    toggleAWSState = () => {
        this.props.toggleAWS()
    }

    render() {
    return (
    <div className="settings-page">
        <Header />
        <div className="settings-header">
            Settings
        </div>
        <div className="settings-main">
            <SettingsMenu menu={this.props.menu.selected}/>
            {
                this.props.menu.selected === 'General' && (
                    <div className="settings-card">
                        <div className="settings-card-title">
                            General Settings
                        </div>
                        <div className="settings-left-side">
                            Operating Mode
                        </div>
                        <div className="settings-switch">
                            <button className="enabled-button">
                                Monitor
                            </button>
                            <button className="disabled-button">
                                Remediate
                            </button>
                        </div>
                        <div className="settings-left-side">
                            API Key
                        </div>
                        <div className="settings-switch">
                            Show
                        </div>
                    </div>
                )
            }
            {
                this.props.menu.selected === 'AWS' && (
                    <div className="settings-card">
                        <div className="settings-card-title">
                            AWS Settings
                        </div>
                        <div className="settings-left-side">
                            Status
                        </div>
                        <div className="settings-switch">
                            {
                                this.props.settings && this.props.settings.Providers && this.props.settings.Providers.find(provider => provider.Name === 'AWS' && provider.Enabled === true) !== undefined && (
                                    <button className="enabled-button" onClick={this.toggleAWSState}>
                                        Enabled
                                    </button>
                                )
                            }
                            {
                                this.props.settings && this.props.settings.Providers.find(provider => provider.Name === 'AWS' && provider.Enabled === false) !== undefined && (
                                    <button className="disabled-button" onClick={this.toggleAWSState}>
                                        Disabled
                                    </button>
                                )
                            }
                        </div>
                        {
                            this.props.accounts.length === 0 && (
                                <div className="settings-card-title">
                                Master account:
                                </div>
                            )
                        }
                        <div className="account-list">
                            <AccountItem key={this.state.AccountHeader.Id} item={this.state.AccountHeader} />
                            {
                                this.props.accounts.find(account => account.Type === 'Master') && this.props.accounts.filter(account => account.Type === 'Master').map(account => {
                                    return <AccountItem key={account.AccountId} item={account} />
                                })
                            }
                            {
                                !this.props.accounts.find(account => account.Type === 'Master') && (
                                    <AddAccount />
                                )
                            }
                        </div>
                        {
                             this.props.accounts.length === 0 && (
                                <div className="settings-card-title">
                                    <div className="account-list">
                                    <div className="account-header">
                                        <div className="account-item-field">
                                            Account ID
                                        </div>
                                        <div className="account-item-field">
                                            Role Name
                                        </div>
                                        <div className="account-item-field">
                                            &nbsp;  
                                        </div>
                                    </div>
                                    <AWSAccount />
                                    </div>
                                </div>
                            )
                        }     
                    </div>
                )
            }
            {
                this.props.menu.selected === 'User' && (
                    <div className="settings-card">
                        <div className="settings-card-title">
                            User Settings
                        </div>
                        <div className="settings-left-side">
                            Theme
                        </div>
                        <div className="settings-switch">
                            <button className="enabled-button">
                                Light
                            </button>
                            <button className="disabled-button">
                                Dark
                            </button>
                        </div>
                    </div>
                )
            }
            
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