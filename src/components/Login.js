import React from "react"
import { navigate } from '@reach/router'
import { setUser, isLoggedIn } from '../utils/auth'
import { connect } from 'react-redux'
import Error from './Error'
import Amplify, { Auth } from 'aws-amplify'
import { saveUser } from '../actions'
import ExternalHeader from './ExternalHeader';

Amplify.configure({
  Auth: {
      
      // REQUIRED - Amazon Cognito Region
      region: 'us-east-1',

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'us-east-1_wMiZuxWyI',

      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: '1ng8vh5ghq0jmjfcecloklp5jb'
  }
});

class Login extends React.Component {
  state = {
    username: ``,
    password: ``,
    error: ``,
    code: ``,
    forgotPassword: false,
    acceptCode: false
  }

  handleUpdate = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleKeyPress = event => {
    if(event.key === 'Enter')
    {
      this.login()
    }
  }

  forgotPassword = () => {
    this.setState({
      forgotPassword: true
    })
  }

  requestPassword = async () => {
      const { username } = this.state;
      await Auth.forgotPassword(username).catch(err => console.log(err));
      this.setState({ 
        acceptCode: true,
        forgotPassword: false
      });
  }

  submitPassword = async () => {
    const { username, code, password } = this.state;
    console.log("Submitting new password!");
    await Auth.forgotPasswordSubmit(username, code, password).catch(err => console.log(err));
    console.log("Password changed!");
    this.setState({
      acceptCode: false
    })
  }

  login = async() => {
    const { username, password } = this.state
    try {
      await Auth.signIn(username, password)
      const user = await Auth.currentAuthenticatedUser()
      
      const userInfo = {
        ...user.attributes,
        username: user.username
      }

      setUser(userInfo)
      this.props.saveUser(userInfo)
      navigate("/app/dashboard")
    } catch (err) {
      this.setState({ error: err })
      console.log('error...: ', err)
    }
  }

  render() {
    if (isLoggedIn()) navigate('/app/dashboard');
    return (
      <div className="login-screen">
        <ExternalHeader />
        {
          !this.state.forgotPassword && !this.state.acceptCode && (
            <div className="login-form">
              <div className="login-header">PurifyCloud</div>
              {this.state.error && <Error errorMessage={this.state.error}/>}
              <div className="login-container">
              <label>Email</label>
              <input
                onChange={this.handleUpdate}
                placeholder='Email'
                name='username'
                value={this.state.username}
                onKeyPress={this.handleKeyPress}
              />
              <label>Password</label>
              <input
                onChange={this.handleUpdate}
                placeholder='Password'
                name='password'
                value={this.state.password}
                type='password'
                onKeyPress={this.handleKeyPress}
              />
              <a onClick={this.forgotPassword}>
                Forgot password? 
              </a>
              <button className="login-button" onClick={this.login}>
                <span className="login-button-text">Sign In</span>
              </button>
              </div>
            </div>
          )
        }
        
        {
          this.state.forgotPassword && (
            <div className="forgot-password-form">
              <p>Enter your email below to set a new password.</p>
              <div className="login-container">
              <label>Email</label>
              <input
                onChange={this.handleUpdate}
                placeholder='user@company.com'
                name='username'
                value={this.state.username}
                onKeyPress={this.handleKeyPress}
              />
              <button className="add-button password-button" onClick={this.requestPassword}>
                Submit
              </button>
              </div>
            </div>
          )
        }
        {
          this.state.acceptCode && (
            <div className="login-form">
              <div className="login-container">
              <p>Enter the confirmation code received by email and a new password to set.</p>
              
              <label>Confirmation Code</label>
              <input
                onChange={this.handleUpdate}
                placeholder='291736'
                name='code'
                value={this.state.code}
                onKeyPress={this.handleKeyPress}
              />
              <label>
                New Password
              </label>
              <input
                onChange={this.handleUpdate}
                placeholder='New password'
                name='password'
                type='password'
                value={this.state.password}
                onKeyPress={this.handleKeyPress}
              />
              <button className="add-button" onClick={this.submitPassword}>
                Submit
              </button>
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
      mobileMenu : state.mobile.mobileMenu
  }
}
  
export default connect(mapStateToProps, { saveUser })(Login)
  