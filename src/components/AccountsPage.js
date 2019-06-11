import React from 'react';
import { connect } from 'react-redux';
import Loading from './Loading';
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
        console.log(this.props);
        return (
            <div className="accounts-page">
                <Header />
                <LeftMenu />
                <div className="accounts">
                    {
                        this.props.Accounts.length === 0 && (
                            <Loading type="spokes" color="33A" height={800} width={600} />
                        )
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