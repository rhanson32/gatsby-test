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
                accountId: account.AccountId,
                provider: account.Provider,
                role: account.RoleName,
                status:  account.Status === "Valid" ?
                <Button type="link" name="off" id={account.AccountId} onClick={this.toggleRule} size="large" onClick={this.toggleRule}>
                    Valid
                </Button> :
                <Button name="monitor" id={account.AccountId} onClick={this.toggleRule} style={{ backgroundColor: account.Enabled ? "#27ae60" : "white", color: account.Enabled ? "white" : "black" }} size="large" onClick={this.toggleRule}>
                    Invalid
                </Button>
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
            {
              title: 'Role',
              dataIndex: 'role',
              key: 'role'
            }
          ];
        return (
            <div className="accounts-page">
                <Header />
                <LeftMenu />
                <div className="accounts">
                  <div className="support-screen-header">
                      <h1>Accounts</h1>
                  </div>
                    {
                        this.props.Accounts.length === 0 && <Spin style={{ margin: "auto" }} size="large" />
                    }
                    {
                        this.props.Accounts.length !== 0 && <Table pagination={this.props.Accounts.length < 10 ? false : { position: "top" }} style={{ width: "80%", margin: "2rem auto", border: "1px solid #CCC", borderRadius: "3px" }} dataSource={dataSource} columns={columns} />
                    }
                   
                </div>
                
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