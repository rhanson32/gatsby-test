import React from "react"
import { navigate } from "@reach/router"
import { connect } from 'react-redux';
import Error from './Error'
import { Auth } from 'aws-amplify'
import { validateCompany } from '../actions'
import ExternalHeader from './ExternalHeader';
import { Input, Button } from 'antd';

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
        signUpResponse = await Auth.signUp({ username: email, password, attributes: { email, "custom:company" : company }}).catch(err => console.log(err));

        if(signUpResponse)
        {
            valid = await validateCompany(this.state);
            if(!valid)
            {
              this.setState({ error: { message: 'Company already exists. Please ask your administrator for access.' } })
            }
            else
            {
              console.log("Proceeding to sign up");
              
              this.setState({ stage: 1 });
              console.log(signUpResponse);
            }
        }
        else 
        {
            console.log("Must delete user with email:", email);
        }
      } catch (err) {
        this.setState({ error: err })
        console.log('error signing up...', err)
      }
    }

    confirmSignUp = async() => {
        const { email, authCode } = this.state
        try {
          await Auth.confirmSignUp(email, authCode)
          alert('Successfully signed up! Click OK to go to the login screen.')
          navigate("/app/login")
        } catch (err) {
          this.setState({ error: err })
          console.log('error confirming signing up...', err)
        }
      }

      render() {
        return (
          <div className="signup-screen">
            <ExternalHeader />
            {
              this.state.stage === 0 && (
                <div className="signup-form">
                  <div className="signup-header">Welcome to PurifyCloud</div>
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
                  <Button loading={this.state.loading} onClick={this.signUp} type="primary">{this.state.buttonText}</Button>
                  </div>  
                </div>
          )
        }
        {
          this.state.stage === 1 && (
            <div className="confirm-form">
              {this.state.error && <Error errorMessage={this.state.error}/>}
              <Input
                onChange={this.handleUpdate}
                placeholder='Authorization Code'
                name='authCode'
                value={this.state.authCode}
              />
              <Button onClick={this.confirmSignUp}>
                Confirm Sign Up
              </Button>
            </div>
          )
        }
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