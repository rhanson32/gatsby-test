import React from "react"
import { navigate } from "@reach/router"
import { connect } from 'react-redux';
import Error from './Error'
import { Auth } from 'aws-amplify'
import { validateCompany } from '../actions'
import ExternalHeader from './ExternalHeader';
import { IoEmail } from 'react-icons/io';
import { Input, Button } from 'antd';

const initialState = {
  username: ``,
  password: ``,
  email: '',
  company: '',
  authCode: '',
  stage: 0,
  error: ''
}

class SignUp extends React.Component {

    state = initialState
  
    handleUpdate = (event) => {
      this.setState({
        [event.target.name]: event.target.value,
      })
    }
  
    signUp = async() => {
      const { password, email, company } = this.state
      try {
        this.setState({ error: null });
        await Auth.signUp({ username: email, password, attributes: { email, "custom:company" : company }})
        this.setState({ stage: 1 })
        await validateCompany(this.state)
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
                <div className={this.props.mobileMenu ? "signup-form mobile-menu-showing" : "signup-form mobile-menu-hidden"}>
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
                  <Button onClick={this.signUp} type="primary">Sign Up</Button>
                  </div>  
                </div>
          )
        }
        {
          this.state.stage === 1 && (
            <div className="signup-form">
              {this.state.error && <Error errorMessage={this.state.error}/>}
              <input
                onChange={this.handleUpdate}
                placeholder='Authorization Code'
                name='authCode'
                value={this.state.authCode}
              />
              <div className="signup-button" onClick={this.confirmSignUp}>
                <span className="signup-button-text">Confirm Sign Up</span>
              </div>
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