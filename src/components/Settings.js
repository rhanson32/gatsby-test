import React from 'react'
import Header from './Header'
import AWSAccount from './AWSAccount';
import { connect } from 'react-redux'
import AccountItem from './AccountItem';
import AddAccount from './AddAccount';
import { Table } from 'antd';
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
        const dataSource = this.props.accounts.map((account, index) => {
            return {
                key: (index + 1).toString(),
                accountId: account.AccountId,
                provider: account.Provider,
                roleName: account.RoleName,
                status: account.Status
            }
        });

        const columns = [
            {
                title: 'Account Id',
                dataIndex: 'accountId',
                key: 'accountId'
            },
            {
                title: 'Provider',
                dataIndex: 'provider',
                key: 'provider'
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status'
            },
            {
                title: 'Role',
                dataIndex: 'roleName',
                key: 'roleName'
            }
        ];
    return (
    <div className="settings-page">
        <Header />
        <LeftMenu />
        <div className="settings-main">
            <div className="settings-header">
                Settings
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