import React from 'react';
import { navigate } from '@reach/router';
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
    loading: false,
    confirmUser: false
  }

  handleUpdate = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleKeyPress = event => {
    if(event.key === 'Enter')
    {
      this.login();
    }
  }

  handlePress = event => {
    if(event.key === 'Enter')
    {
      this.confirmMFA();
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

  resendCode = async () => {
    const { username } = this.state;
    const response = await Auth.resendSignUp(username).catch(err => console.log(err));
    console.log(response);
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

  confirmUser = async () => {
    const { username, code, password } = this.state;
    const response = await Auth.confirmSignUp(username, code).catch(err => console.log(err));
    console.log(response);
    if(response)
    {
      await Auth.signIn(username, password).catch(err => console.log(err));
      navigate('/app/dashboard');
    }
  }

  returnToLogin = () => {
    this.setState({
        acceptCode: false,
        inputMFA: false,
        forgotPassword: false,
        confirmUser: false,
        loading: false,
        buttonText: 'Sign In'
    })
  }

  confirmMFA = async () => {
    const response = await Auth.confirmSignIn(this.state.user, this.state.mfaCode, "SOFTWARE_TOKEN_MFA").catch(err => console.log(err));

    console.log(response);

    if(response)
    {
      navigate('/app/dashboard');
    }
  }

  login = async () => {
    const { username, password } = this.state
    try {
      this.setState({ loading: true, buttonText: 'Signing In...' });
      const user = await Auth.signIn(username, password);

      this.setState({
        user
      });
      console.log(user);
      const userInfo = {
        ...user.attributes,
        username: user.username,
        // group: user.signInUserSession.idToken.payload['cognito:groups'][0]
      }

      console.log(userInfo);
      setUser(userInfo);
      await this.props.saveUser(userInfo);
      setExpiration(moment().add(8, 'hours').toISOString());
      console.log(this.state.user.challengeName);
      if(this.state.user.challengeName === "SOFTWARE_TOKEN_MFA")
      {
        this.setState({
          inputMFA: true
        });
      }
      else
      {
        console.log("Navigating to new page...");
        navigate("/app/dashboard");
      }
      console.log(this.state.inputMFA);
    } catch (err) {
      this.setState({ error: err })
      console.log('Error: ', err);
      console.log(err.code);
      if(this.state.user.challengeName === "SOFTWARE_TOKEN_MFA")
      {
        this.setState({
          inputMFA: true
        })
      }
      else if(err.code === 'UserNotConfirmedException')
      {
        this.resendCode();
        this.setState({ confirmUser: true });
      }
      else if(err === 'not authenticated')
      {
        this.setState({acceptCode: true });
        this.props.confirmUser(username);
      }
    }
  }

  render() {
    // if (isLoggedIn()) navigate('/app/dashboard');
    return (
      <div className="login-screen">
        <ExternalHeader />
        {
          !this.state.forgotPassword && !this.state.acceptCode && !this.state.confirmUser && !this.state.inputMFA && (
            <div className="login-form">
              <div className="login-header">PurifyCloud</div>
              {this.state.error && <Error errorMessage={this.state.error}/>}
              <div className="login-container">
                <label>Email</label>
                <Input placeholder="Email" name="username" value={this.state.username} onChange={this.handleUpdate} onKeyPress={this.handleKeyPress} />
                <label>Password</label>
                <Input.Password placeholder="Password" onChange={this.handleUpdate} name="password" value={this.state.password} onKeyPress={this.handleKeyPress} />
                <div className="login-buttons">
                <Button type="link" onClick={this.forgotPassword}>
                  Forgot password? 
                </Button>
                </div>
                <Button type="primary" loading={this.state.loading} onClick={this.login}>{this.state.buttonText}</Button>
              </div>
            </div>
          )
        }
        {
          this.state.inputMFA && (
            <div className="login-form">
              <div className="login-header">MFA Code Required</div>
              <div className="login-container">
                <label>Code from MFA device:</label>
                <Input name="mfaCode" value={this.state.mfaCode} onChange={this.handleUpdate} onKeyPress={this.handlePress} />
                <Button type="primary" onClick={this.confirmMFA}>Submit</Button>
                <Button onClick={this.returnToLogin} type="link">Back to Login ></Button>
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
                <label style={{ marginBottom: "0.2rem" }}>Email</label>
                <Input placeholder="Email" name="username" value={this.state.username} onChange={this.handleUpdate} onKeyPress={this.handleKeyPress} />
                <div>&nbsp;</div>
                <Button onClick={this.requestPassword} type="primary">Submit</Button>
                <Button onClick={this.returnToLogin} type="link">Back to Login ></Button>
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
        {
          this.state.confirmUser && (
            <div className="login-form">
              <div className="login-header">Confirm User Account</div>
              <div className="login-container">
                <p>Enter the confirmation code received by email in order to confirm this user account.</p>
                <label>Confirmation Code</label>
                <Input 
                  onChange={this.handleUpdate}
                  placeholder='e.g. 291736'
                  name='code'
                  value={this.state.code}
                  onKeyPress={this.handleKeyPress}
                />
                <Button onClick={this.resendCode}>Resend Code</Button>
                <Button onClick={this.confirmUser} type="primary">Submit</Button>
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
  