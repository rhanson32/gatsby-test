import React from 'react'
import Header from './Header'
import SettingsMenu from './SettingsMenu';
import AddAccount from './AddAccount';
import AccountItem from './AccountItem';
import { connect } from 'react-redux'
import { getSettings } from '../actions'

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
                        <div className="settings-switch">
                            Operating Mode
                            <button>
                                Monitor
                            </button>
                            <button>
                                Remediate
                            </button>
                        </div>
                        <div className="settings-switch">
                            API Key:
                        </div>
                    </div>
                )
            }
            {
                this.props.menu.selected === 'AWS' && (
                    <div className="settings-card">
                        <div className="settings-provider">
                            <div className="settings-provider-option">
                                <div className="settings-provider-option-header">
                                    AWS Settings
                                </div>
                                <div className="settings-provider-option-select">
                                    Enabled:
                                    <button className={this.props.settings.Providers.find(provider => provider.Name === 'AWS' && provider.Enabled === true) ? 'enabled-button': 'disabled-button'}>
                                        ON
                                    </button>
                                    <button className={this.props.settings.Providers.find(provider => provider.Name === 'AWS' && provider.Enabled === false) ? 'enabled-button': 'disabled-button'}>
                                        OFF
                                    </button>
                                </div>
                            </div>
                        </div>
                        {
                            this.props.accounts.length === 0 && (
                                <div>
                                    Master account:
                                    <AccountItem key={this.state.AccountHeader.Id} item={this.state.AccountHeader} />
                                    <AddAccount />
                                </div>
                            )
                        }
                        
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

export default connect(mapStateToProps, { getSettings })(Settings);