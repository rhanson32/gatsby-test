import React from 'react';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { addUser } from '../actions';

const generator = require('generate-password');

class AddUser extends React.Component {
    state = {
        email: ``,
        selectedOption: 'Auditor',
        errorMessage: ``
    }

    handleUpdate = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
          })
    }

    handleOptionChange = (changeEvent) => {
        this.setState({
          selectedOption: changeEvent.target.value
        });
    }

    handleSubmit = () => {
        if(this.state.email === '')
        {
            console.log("Enter an email address");
            notification.error({
                message: 'Email address required',
                description: 'Please enter a valid email address.'
            });
        }
        else if(!this.state.email.includes('@'))
        {
            console.log('Please enter a valid email format');
            notification.error({
                message: 'Email address required',
                description: 'Please enter a valid email address with the correct format.'
            });
        }
        else 
        {
            let password = generator.generate({
                length: 10,
                numbers: true,
                symbols: true,
                strict: true
            });
            console.log(password);
            console.log(this.state.email);
            this.props.addUser({ email: this.state.email, password, company: this.props.user['custom:company'], group: this.state.selectedOption });
        }
    }

    render() {
        return (
            <div className="add-user">
                <div className="add-user-header">
                    <div className="add-user-header-item">
                        Email
                    </div>
                    <div className="add-user-header-item">
                        Group
                    </div>
                </div>
                <div className="add-user-item">
                    <div className="add-user-item-container">
                        <input 
                            onChange={this.handleUpdate}
                            className="user-email"
                            type="email"
                            placeholder="user@company.com" 
                            name="email"
                        />
                    </div>
                    <div className="add-user-item-container">
                        <input 
                            className="user-radio"
                            type="radio"
                            value="Administrator"
                            checked={this.state.selectedOption === 'Administrator'}
                            name="group"
                            onChange={this.handleOptionChange}
                        />
                        <label>
                            Administrator
                        </label>
                        <input
                            className="user-radio"
                            type="radio"
                            value="Auditor"
                            name="group"
                            checked={this.state.selectedOption === 'Auditor'}
                            onChange={this.handleOptionChange}
                        />
                        <label>
                            Auditor
                        </label>
                    </div>
                    <div className="add-user-button">
                        <button 
                            className="add-button"
                            onClick={this.handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { addUser })(AddUser);