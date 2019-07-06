import React from 'react'
import Header from './Header'
import { connect } from 'react-redux'
import TabsCard from './TabsCard';
import { getSettings, toggleAWS, getAccounts, getCurrentUser } from '../actions'
import LeftMenu from './LeftMenu';

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
        <Header />
        <LeftMenu />
        <div className="settings-main">
            <div className="support-screen-header">
                <h1>Settings</h1>
            </div>
            <TabsCard />
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