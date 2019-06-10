import React from 'react';

class AccountItem extends React.Component { 

    removeAccount = () => {
        console.log("Removed!");
    }

    render() {
        return (
            <div className={this.props.item.Header ? "account-header" : "account-item"}>
                <div className="account-item-field">
                    {this.props.item.AccountId}
                </div>
                <div className="account-item-field">
                    {this.props.item.Provider}
                </div>
                <div className="account-item-field">
                    {this.props.item.Status}
                </div>
                <div className="account-item-field">
                    {this.props.item.RoleName}
                </div>
                {
                    !this.props.item.Header && (
                        <div className="account-buttons">
                            <button onClick={this.removeAccount} className="remove-button">Remove</button>
                        </div>
                    )
                }
                {
                    this.props.item.Header && (
                        <div className="account-item-field">
                            Action
                        </div>
                    )
                }
                
            </div>
        )
    }
}

export default AccountItem;