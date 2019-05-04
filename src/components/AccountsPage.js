import React from 'react';
import { connect } from 'react-redux';

import AccountItem from '../components/AccountItem';
import { postAccount, getAccounts } from '../actions';

class Accounts extends React.Component {
    componentDidMount() {
        this.props.getAccounts();
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
        this.setState({ AddAccount: true });  
    }

    submitAccount = () => {
        this.setState({ AddAccount: false});
        postAccount();
    }

    render() {
        console.log(this.props);
        return (
            <div className="accounts">
                <div className="account-list">
                    <AccountItem key={this.state.AccountHeader.Id} item={this.state.AccountHeader} />
                    {
                        this.props.Accounts.map(account => {
                            return <AccountItem key={account.AccountId} item={account} />
                        })
                    }
                    {
                        this.state.AddAccount && (
                            <div>
                                Adding Account...
                            <button onClick={this.submitAccount}>Submit</button>
                            </div>
                        )
                    }
                    <div>
                        <div>
                            &nbsp;
                        </div>
                        <div>
                            &nbsp;
                        </div>
                        {
                            !this.state.AddAccount && (
                                <div className="account-add">
                                    <button onClick={this.addAccount} className="add-button">Add Account</button>
                                </div>
                            )
                        }
                        
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        Accounts: state.accounts
    }
}

export default connect(mapStateToProps, { getAccounts })(Accounts);