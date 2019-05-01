import React from "react";
import AccountItem from '../components/AccountItem';
import Header from '../components/Header';

class Accounts extends React.Component {

    state = {
        Accounts: [ 
            {
                Id: '12345',
                Provider: 'AWS',
                RoleName: 'testRole1'
            },
            {
                Id: '12456',
                Provider: 'AWS',
                RoleName: 'testRole2'
            },
            {
                Id: '23456',
                Provider: 'AWS',
                RoleName: 'testRole3'
            },
            {
                Id: '56789',
                Provider: 'AWS',
                RoleName: 'testRole4'
            }
        ],
        AccountHeader: {
            Id: 'Account ID',
            Provider: 'Provider',
            RoleName: 'Role Name',
            Header: true
        }
    };

    render() {
        console.log(this.state);
        return (
            <div className="app">
                <Header />
                <div className="accounts">
                    <div className="account-list">
                        <AccountItem key={this.state.AccountHeader.Id} item={this.state.AccountHeader} />
                        {
                            this.state.Accounts.map(account => {
                                return <AccountItem key={account.Id} item={account} />
                            })
                        }
                        <div>
                            <div>
                                &nbsp;
                            </div>
                            <div>
                                &nbsp;
                            </div>
                            <div className="account-add">
                                <button onClick={this.addAccount} className="add-button">Add Account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Accounts;