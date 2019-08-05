import React from 'react';
import { navigate } from '@reach/router';
import { setUser, setExpiration } from '../utils/auth'
import { connect } from 'react-redux'
import Error from './Error'
import Amplify, { Auth } from 'aws-amplify'
import { saveUser, confirmUser } from '../actions'
import ExternalHeader from './ExternalHeader';
import { Input, Button } from 'antd';
import moment from 'moment';
import google from '../../static/btn_google_signin_dark_normal_web.png';
import { IoTJobsDataPlane } from 'aws-sdk';

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

  componentDidMount() {
    const ga = window.gapi && window.gapi.auth2 ? 
        window.gapi.auth2.getAuthInstance() : 
        null;
    if (!ga) this.createScript();
  }

  createScript = () => {
      // load the Google SDK
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/platform.js';
      script.async = true;
      script.onload = this.initGapi;
      document.body.appendChild(script);
  }
  
  signIn = () => {
    const ga = window.gapi.auth2.getAuthInstance();
    console.log(ga);
    ga.signIn().then(
        googleUser => {
            this.getAWSCredentials(googleUser);
        },
        error => {
            console.log(error);
        }
    );
  }
  
  initGapi = () => {
    // init the Google SDK client
    const g = window.gapi;
    g.load('auth2', function() {
        g.auth2.init({
            client_id: '1024277314293-hophqvo9ih3lk5gba37evbm6k83qmi2c.apps.googleusercontent.com',
            // authorized scopes
            scope: 'email'
        });
    });
}

  getAWSCredentials = async (googleUser) => {
    const { id_token, expires_at } = googleUser.getAuthResponse();
    const profile = googleUser.getBasicProfile();
    console.log(profile);
    let user = {
        email: profile.getEmail(),
        name: profile.getName()
    };
    console.log(id_token);
    const credentials = await Auth.federatedSignIn(
        'google',
        { token: id_token, expires_at },
        user
    ).catch(err => console.log(err));
    console.log('credentials', credentials);
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

      const userInfo = {
        ...user.attributes,
        username: user.username,
        // group: user.signInUserSession.idToken.payload['cognito:groups'][0]
      }

      setUser(userInfo);
      await this.props.saveUser(userInfo);
      setExpiration(moment().add(8, 'hours').toISOString());

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
    } catch (err) {
      this.setState({ error: err, loading: false, buttonText: 'Sign In' })
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
    console.log(window.location.search);
    return (
      <div className="login-screen">
        <ExternalHeader />
        {
          !this.state.forgotPassword && !this.state.acceptCode && !this.state.confirmUser && !this.state.inputMFA && (
            <div className="login-form">
              <div className="login-header">Login to your PurifyCloud account</div>
              {this.state.error && <Error errorMessage={this.state.error}/>}
              <div className="login-container">
                <label>Email</label>
                <Input placeholder="Email" allowClear name="username" value={this.state.username} onChange={this.handleUpdate} onKeyPress={this.handleKeyPress} />
                <label>Password</label>
                <Input.Password placeholder="Password" allowClear onChange={this.handleUpdate} name="password" value={this.state.password} onKeyPress={this.handleKeyPress} />
                <div className="login-buttons">
                <Button type="link" onClick={this.forgotPassword}>
                  Forgot password? 
                </Button>
                </div>
      
                <Button type="primary" loading={this.state.loading} onClick={this.login}>{this.state.buttonText}</Button>
                <a onClick={this.signIn}><img src={google} /></a>
              </div>
            </div>
          )
        }
        {
          this.state.inputMFA && (
            <div className="login-form">
              <div className="login-header">Authentication Code Required</div>
              <div className="login-container">
                <label style={{ padding: "0.3rem 0"}}>MFA Code:</label>
                <Input 
                  name="mfaCode" 
                  allowClear 
                  value={this.state.mfaCode} 
                  onChange={this.handleUpdate} 
                  onKeyPress={this.handlePress} 
                  autoFocus
                />
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
                <Input 
                  placeholder="Email" 
                  name="username" 
                  allowClear 
                  autoFocus
                  value={this.state.username} 
                  onChange={this.handleUpdate} 
                  onKeyPress={this.handleKeyPress} 
                />
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
                  allowClear
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
                  allowClear
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
                  allowClear
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
  