import React from 'react';
import { connect } from 'react-redux';

import AccountItem from './AccountItem';
import Header from './Header'
import AddAccount from './AddAccount';
import { postAccount, getAccounts, toggleAddAccount, getCurrentUser } from '../actions';

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
        },
        AddAccount: false
    };

    addAccount = () => {
        this.props.toggleAddAccount();
    }

    submitAccount = () => {
        this.setState({ AddAccount: false});
        postAccount();
    }

    render() {
        console.log(this.props);
        return (
            <div>
                <Header />
            <div className="accounts">
                {
                    this.props.Accounts.length === 0 && (
                        <div className="account-list">
                            <div className="accounts-header">
                                <h2>Master account required</h2>
                                <p>Please enter the Master account of your AWS Organization. This account will be used to discover the rest of the accounts in your organization.</p>
                                <br />
                                <p>Note: In order for Purify to access the account, you will first need to create an IAM role that allows cross-account access. Learn more here.</p>
                            </div>
                            
                            <AccountItem key={this.state.AccountHeader.Id} item={this.state.AccountHeader} />
                            <AddAccount />
                        </div>
                    )
                }
                {
                    this.props.Accounts.length !== 0 && (
                        <div className="account-list">
                            <AccountItem key={this.state.AccountHeader.Id} item={this.state.AccountHeader} />
                            {
                                this.props.Accounts.map(account => {
                                    return <AccountItem key={account.AccountId} item={account} />
                                })
                            }
                            {
                                this.props.Flags.AddAccount && <AddAccount />
                            }
                            <div>
                                <div>
                                    &nbsp;
                                </div>
                                <div>
                                    &nbsp;
                                </div>
                                {
                                    !this.props.Flags.AddAccount && (
                                        <div className="account-add">
                                            <button onClick={this.addAccount} className="add-button">Add Account</button>
                                        </div>
                                    )
                                }
                                
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
        Accounts: state.accounts,
        Flags: state.flags,
        user: state.user
    }
}

export default connect(mapStateToProps, { getAccounts, toggleAddAccount, getCurrentUser })(Accounts);