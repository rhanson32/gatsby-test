import React from 'react'
import Header from './Header'
import SettingsMenu from './SettingsMenu';
import AWSAccount from './AWSAccount';
import AccountItem from './AccountItem';
import { connect } from 'react-redux'
import { getSettings, toggleAWS } from '../actions'

class Settings extends React.Component {

    state = {
        AccountHeader: {
            AccountId: 'Account ID',
            Provider: 'Provider',
            RoleName: 'Role Name',
            Header: true
        },
        AddAccount: false
    };

    componentDidMount() {
        this.props.getSettings()
    }

    toggleAWSState = () => {
        this.props.toggleAWS()
    }

    render() {
        console.log(this.props);
    return (
    <div className="settings-page">
        <Header />
        <div className="settings-header">
            Settings
        </div>
        <div className="settings-main">
            <SettingsMenu />
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
                                Remediate
                            </button>
                            <button className="disabled-button">
                                Monitor
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
                                this.props.settings && this.props.settings.Providers.find(provider => provider.Name === 'AWS' && provider.Enabled === true) !== undefined && (
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
        accounts: state.accounts
    }
}

export default connect(mapStateToProps, { getSettings, toggleAWS })(Settings);