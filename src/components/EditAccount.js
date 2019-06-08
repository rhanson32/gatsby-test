import React from 'react';
import { connect } from 'react-redux';
import { updateAccount } from '../actions';

class EditAccount extends React.Component {
    state = {
        role: ``
    }

    updateAccount = () => {
        this.props.updateAccount(this.props.item, this.state.role);
    }

    handleUpdate = (event) => {
        this.setState({
          [event.target.name]: event.target.value,
        })
      }

    render() {
        console.log(this.props);
        return (
            <div className="account-item">
                <div className="account-item-field">
                    {this.props.item.AccountId}
                </div>
                <div className="account-item-field">
                    {this.props.item.Provider}
                </div>
                <div className="account-item-field-large">
                    <input
                    onChange={this.handleUpdate}
                    placeholder="Enter role name"
                    name="role"
                    value={this.state.role}
                    />
                </div>
                {
                    !this.props.item.Header && (
                        <div className="account-buttons">
                            <button onClick={this.updateAccount} className="add-button">Update</button>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default connect(null, { updateAccount })(EditAccount);