import React from "react"
import { navigate } from '@reach/router'
import { setUser, isLoggedIn, setExpiration } from '../utils/auth'
import { connect } from 'react-redux'
import Error from './Error'
import Amplify, { Auth } from 'aws-amplify'
import { saveUser, confirmUser } from '../actions'
import ExternalHeader from './ExternalHeader';
import { Input, Button } from 'antd';
import moment from 'moment';

Amplify.configure({
  Auth: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_wMiZuxWyI',
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
    acceptCode: false,
    buttonText: 'Sign In',
    loading: false
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

  login = async () => {
    const { username, password } = this.state
    try {
      this.setState({ loading: true, buttonText: 'Signing In...' });
      const loginResponse = await Auth.signIn(username, password);
      console.log(loginResponse);
      const user = await Auth.currentAuthenticatedUser();
      console.log(user);
      const userInfo = {
        ...user.attributes,
        username: user.username
      }

      console.log(userInfo);
      setUser(userInfo)
      this.props.saveUser(userInfo)
      setExpiration(moment().add(12, 'hours').toISOString())
      navigate("/app/dashboard")
    } catch (err) {
      this.setState({ error: err })
      console.log('error...: ', err)
      console.log(this.state);
      if(err === 'not authenticated')
      {
        this.setState({acceptCode: true });
        this.props.confirmUser(username);
      }
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
                <Input placeholder="Email" name="username" value={this.state.username} onChange={this.handleUpdate} onKeyPress={this.handleKeyPress} />
                <label>Password</label>
                <Input.Password placeholder="Password" onChange={this.handleUpdate} name="password" value={this.state.password} onKeyPress={this.handleKeyPress} />
                <a className="forgot-password" onClick={this.forgotPassword}>
                  Forgot password? 
                </a>
                <Button type="primary" loading={this.state.loading} onClick={this.login}>{this.state.buttonText}</Button>
              </div>
            </div>
          )
        }
        {
          this.state.forgotPassword && (
            <div className="forgot-password-form">
              <div className="login-header">Forgotten Password Form</div>
              <div className="login-container">
                <p>Enter your email below to set a new password.</p>
                <label>Email</label>
                <Input placeholder="Email" name="username" value={this.state.username} onChange={this.handleUpdate} onKeyPress={this.handleKeyPress} />
                <Button onClick={this.requestPassword} type="primary">Submit</Button>
              </div>
            </div>
          )
        }
        {
          this.state.acceptCode && (
            <div className="login-form">
              <div className="login-header">Set New Password</div>
              <div className="login-container">
                <p>Enter the confirmation code received by email and a new password to set.</p>
                <label>Confirmation Code</label>
                <Input 
                  onChange={this.handleUpdate}
                  placeholder='e.g. 291736'
                  name='code'
                  value={this.state.code}
                  onKeyPress={this.handleKeyPress}
                />
                <Button onClick={this.requestPassword}>Resend Code</Button>
                <label>
                  New Password
                </label>
                <Input
                  onChange={this.handleUpdate}
                  placeholder='New password'
                  name='password'
                  value={this.state.password}
                  onKeyPress={this.handleKeyPress}
                />
                <Button onClick={this.submitPassword} type="primary">Submit</Button>
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
  
export default connect(mapStateToProps, { saveUser, confirmUser })(Login)
  