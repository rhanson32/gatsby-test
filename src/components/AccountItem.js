import React from 'react';

class AccountItem extends React.Component { 

    removeAccount = () => {
        console.log("Removed!");
    }

    render() {
        return (
            <div className="account-item">
                <div>
                    {this.props.item.Id}
                </div>
                <div>
                    {this.props.item.Provider}
                </div>
                <div>
                    {this.props.item.RoleName}
                </div>
                <div className="account-buttons">
                    <button onClick={this.removeAccount} className="right-button remove-button">Remove</button>
                </div>
            </div>
        )
    }
}

export default AccountItem;