import React from 'react';

class AccountItem extends React.Component { 

    removeAccount = () => {
        console.log("Removed!");
    }

    render() {
        return (
            <div className={this.props.item.Header ? "account-header" : "account-item"}>
                <div>
                    {this.props.item.AccountId}
                </div>
                <div>
                    {this.props.item.Provider}
                </div>
                <div>
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
                        <div>
                            Action
                        </div>
                    )
                }
                
            </div>
        )
    }
}

export default AccountItem;