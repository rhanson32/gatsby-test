import React from 'react';
import { connect } from 'react-redux';
import { Spin, Button, Table } from 'antd';
import AccountItem from './AccountItem';
import Header from './Header'
import EditAccount from './EditAccount';
import { postAccount, getAccounts, toggleAddAccount, getCurrentUser } from '../actions';
import LeftMenu from './LeftMenu';

class Accounts extends React.Component {
    componentDidMount = async () => {
        if(!this.props.user || !this.props.user.CustomerId)
        {
            await this.props.getCurrentUser()
        }
        if(this.props.user && this.props.user.CustomerId)
        {
            this.props.getAccounts(this.props.user.CustomerId);
        }      
    }
    componentDidUpdate() {
    
    }

    state = {
        AccountHeader: {
            AccountId: 'Account ID',
            Provider: 'Provider',
            RoleName: 'Role Name',
            Header: true
        }
    };

    addAccount = () => {
        this.props.toggleAddAccount();
    }

    submitAccount = () => {
        this.setState({ AddAccount: false});
        postAccount();
    }

    render() {
        const dataSource = this.props.Accounts && this.props.Accounts.map((account, index) => {
            return {
                key: index.toString(),
                name: account.Name,
                category: account.Category,
                accountId: account.AccountId,
                provider: account.Provider,
                state: account.Enabled ? "Monitor" : "Off",
                status:  <Button.Group>
                <Button type="link" name="off" id={account.AccountId} onClick={this.toggleRule} size="large" onClick={this.toggleRule}>
                    Valid
                </Button>
                <Button name="monitor" id={account.AccountId} onClick={this.toggleRule} style={{ backgroundColor: account.Enabled ? "#27ae60" : "white", color: account.Enabled ? "white" : "black" }} size="large" onClick={this.toggleRule}>
                    Invalid
                </Button>
            </Button.Group>,
                description: account.Description
            }    
        });
          
          const columns = [
            {
              title: 'Account ID',
              dataIndex: 'accountId',
              key: 'accountId',
                sorter: (a, b) => a.accountId.length - b.accountId.length,
                sortDirections: ['descend', 'ascend']
            },
            {
              title: 'Provider',
              dataIndex: 'provider',
              key: 'provider',
              filters: [
                {
                  text: 'AWS',
                  value: 'AWS',
                },
                {
                  text: 'Azure',
                  value: 'Azure',
                }
              ],
                onFilter: (value, record) => record.provider.indexOf(value) === 0,
                sorter: (a, b) => a.provider.length - b.provider.length,
                sortDirections: ['descend', 'ascend']
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              filters: [
                {
                  text: 'Valid',
                  value: 'Valid',
                },
                {
                  text: 'Invalid',
                  value: 'Invalid',
                }
              ],
              onFilter: (value, record) => record.state.indexOf(value) === 0
            },
          ];
        return (
            <div className="accounts-page">
                <Header />
                <LeftMenu />
                <div className="accounts">
                    {
                        this.props.Accounts.length === 0 && <Spin style={{ margin: "auto" }} size="large" />
                    }
                    {
                        this.props.Accounts.length !== 0 && (
                            <div className="account-list">
                                <div className="account-header">
                                    <div className="account-item-field">
                                        Account ID
                                    </div>
                                    <div className="account-item-field">
                                        Provider
                                    </div>
                                    <div className="account-item-field">
                                        Status
                                    </div>
                                    <div className="account-item-field">
                                        Role Name
                                    </div>
                                    <div className="account-item-field">
                                        &nbsp;
                                    </div>
                                </div>
                                {
                                    this.props.Accounts.map(account => {
                                        if(account.RoleName !== "None")
                                        {
                                            return <AccountItem key={account.AccountId} item={account} />
                                        }
                                        else
                                        {
                                            return <EditAccount key={account.AccountId} item={account} />
                                        }
                                    })
                                }
                            </div>
                        )
                    }
                </div>
                <Table pagination={{ position: "top" }} style={{ width: "80%", margin: "auto" }} dataSource={dataSource} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        Accounts: state.accounts,
        Flags: state.flags,
        user: state.user
    }
}

export default connect(mapStateToProps, { getAccounts, toggleAddAccount, getCurrentUser })(Accounts);