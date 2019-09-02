import React from "react"
import { navigate } from "@reach/router"
import { connect } from 'react-redux';
import Error from './Error'
import { Auth } from 'aws-amplify'
import { validateCompany } from '../actions'
import ExternalHeader from './ExternalHeader';
import { Input, Button, notification } from 'antd';
import welcome from '../../static/undraw_welcome.svg';

const initialState = {
  username: ``,
  password: ``,
  email: '',
  company: '',
  authCode: '',
  stage: 0,
  error: '',
  buttonText: 'Sign Up',
  loading: false
}

class SignUp extends React.Component {

    state = initialState
  
    handleUpdate = (event) => {
      this.setState({
        [event.target.name]: event.target.value,
      })
    }
  
    signUp = async() => {
      this.setState({ loading: true, buttonText: 'Creating Account...' });
      const { password, email, company } = this.state;
      let valid;
      let signUpResponse
      try {
        this.setState({ error: null });
        signUpResponse = await Auth.signUp({ username: email, password, attributes: { email, "custom:company" : company.replace(/ /g, '-') }}).catch(err => {
          console.log(err);
          if(err.code === 'UsernameExistsException')
          {
            this.setState({
              error: 'Username already exists. Please login with username and password or use another email address.'
            });
          }
          else
          {
            this.setState({
              error: 'An error occurred. Please try again.'
            });
          }
          this.setState({ loading: false });
        });

        if(signUpResponse)
        {
            valid = await validateCompany(this.state).catch(err => console.log(err));
            if(!valid)
            {
              this.setState({ error: { message: 'Company name already exists. Please ask your administrator for access.' } })
            }
            else
            {
              this.setState({ stage: 1 });
              notification.success({
                message: 'Sign Up Complete',
                description: 'Account created successfully.'
              });
            }
        }
      } catch (err) {
        this.setState({ 
          error: err,
          loading: false
        });
      }
    }

    confirmSignUp = async() => {
        const { email, authCode } = this.state;
        try {
          await Auth.confirmSignUp(email, authCode).catch(err => console.log(err));
          alert('Successfully signed up! Click OK to go to the login screen.');
          navigate("/app/login");
        } catch (err) {
          this.setState({ error: err });
        }
      }

      render() {
        return (
          <div className="signup-screen">
            <ExternalHeader />
            {
              this.state.stage === 0 && (
                <div className="signup-form">
                  <div className="signup-header">Welcome to Purify</div>
                    {this.state.error && <Error errorMessage={this.state.error}/>}
                  <div className="signup-container">
                    <label>Email</label>
                    <Input 
                      onChange={this.handleUpdate}
                      placeholder='you@yourcompany.com'
                      name='email'
                      value={this.state.email}
                      allowClear
                    />
                    <label>Password</label>
                    <Input 
                      onChange={this.handleUpdate}
                      placeholder='Password'
                      name='password'
                      value={this.state.password}
                      type='password'
                      allowClear
                    />
                    <label>Company</label>
                    <Input 
                      onChange={this.handleUpdate}
                      placeholder='YourCorp'
                      name='company'
                      value={this.state.company}
                      allowClear
                    />
                    <Button 
                      loading={this.state.loading} 
                      onClick={this.signUp} 
                      type="primary">
                        {this.state.buttonText}
                    </Button>
                  </div>  
                </div>
          )
        }
        {
          this.state.stage === 1 && (
            <div className="confirm-form">
              {this.state.error && <Error errorMessage={this.state.error}/>}
              <div>
                Please enter the authorization code you received by email to validate your email address.
              </div>
              <label>Authorization Code</label>
              <Input
                onChange={this.handleUpdate}
                placeholder='Authorization Code'
                name='authCode'
                value={this.state.authCode}
              />
              <Button type="primary" onClick={this.confirmSignUp}>
                Confirm Sign Up
              </Button>
              <Button type="link">
                Send me another code
              </Button>
            </div>
          )
        }
        <div className="login-image">
          <img src={welcome} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    mobileMenu: state.mobile.mobileMenu
  }
}
  
export default connect(mapStateToProps, null)(SignUp);