import React from 'react';
import { navigate } from '@reach/router';
import { setUser, setExpiration, isLoggedIn } from '../utils/auth'
import { connect } from 'react-redux'
import Error from './Error'
import Amplify, { Auth } from 'aws-amplify'
import { saveUser } from '../actions'
import ExternalHeader from './ExternalHeader';
import { Input, Button, notification } from 'antd';
import { Icon } from 'tabler-react';
import moment from 'moment';
import login from '../../static/undraw_Login.svg';

Amplify.configure({
  Auth: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_wMiZuxWyI',
      userPoolWebClientId: '460d418243ki5gtsqebnsbt1na'
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
      await Auth.forgotPassword(username).catch(err => {
        console.log(err);
        if(err.code === 'NetworkError')
        {
          notification.error({
            message: 'Network Error',
            description: 'Unable to initiate forgotten password workflow due to network error. Please check your network connection and try again.'
          });

          this.setState({ loading: false, buttonText: 'Sign In' })
        }
      });
      this.setState({ 
        acceptCode: true,
        forgotPassword: false
      });
  }

  resendCode = async () => {
    const { username } = this.state;
    const response = await Auth.resendSignUp(username).catch(err => {
      console.log(err);
      if(err.code === 'NetworkError')
      {
        notification.error({
          message: 'Network Error',
          description: 'Unable to send authentication code due to network error. Please check your network connection and try again.'
        });

        this.setState({ loading: false, buttonText: 'Sign In' })
      }
      else if(err.code === 'LimitExceededException')
      {
        notification.error({
          message: 'Attempt Limit Exceeded',
          description: err.message
        });
      }
    });
    console.log(response);
  }

  submitPassword = async () => {
    const { username, code, password } = this.state;
    console.log("Submitting new password!");
    await Auth.forgotPasswordSubmit(username, code, password).then(data => {
      console.log("Password changed!");
      this.setState({
        acceptCode: false
      })
    })
    .catch(err => {
      console.log(err);
      if(err.code === 'NetworkError')
        {
          notification.error({
            message: 'Network Error',
            description: 'Unable to submit new password due to network error. Please check your network connection and try again.'
          });
        }
    });
    
  }

  confirmUser = async () => {
    const { username, code, password } = this.state;
    console.log(username);
    console.log(code);
    const response = await Auth.confirmSignUp(username, code).catch(err => {
      console.log(err);
      if(err.code === 'NetworkError')
        {
          notification.error({
            message: 'Network Error',
            description: 'Unable to confirm user due to network error. Please check your network connection and try again.'
          });
        }
    });

    if(response)
    {
      let user = await Auth.signIn(username, password).catch(err => {
        console.log(err);
        if(err.code === 'NetworkError')
        {
          notification.error({
            message: 'Network Error',
            description: 'Unable to sign in and redirect user due to network error. Please check your network connection and try again.'
          });

          this.setState({ loading: false, buttonText: 'Sign In' });
        }
        else if(err.code === 'NotAuthorizedException')
        {
          notification.error({
            message: 'Not Authorized',
            description: 'Unable to sign in to Purify app. Please contact support@purify.cloud for assistance.'
          });

          this.setState({ loading: false, buttonText: 'Sign In' });
        }
      });

      if(user !== undefined)
      {
        this.setState({
          user
        });

        console.log(user);

        const userInfo = {
          ...user.attributes,
          username: user.username,
          expiration: moment().add(12, 'hours').toISOString()
        }

        console.log(userInfo);

        setUser(userInfo);
        setExpiration(moment().add(12, 'hours').toISOString());
        await this.props.saveUser(userInfo);
        console.log("Navigating to new page...");
        navigate("/app/dashboard");
      }
      
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
    this.setState({ loading: false, buttonText: 'Confirming code...' })
    const response = await Auth.confirmSignIn(this.state.user, this.state.mfaCode, "SOFTWARE_TOKEN_MFA").catch(err => {
      console.log(err);
      if(err.code === 'NetworkError')
        {
          notification.error({
            message: 'Network Error',
            description: 'Unable to confirm MFA due to network error. Please check your network connection and try again.'
          });
        }
    });

    if(response)
    {
      navigate('/app/dashboard');
    }
  }

  login = async () => {
    
    const { username, password } = this.state;

    try {
      this.setState({ loading: true, buttonText: 'Signing In...' });
      const user = await Auth.signIn(username, password).catch(err => {
        console.log(err);
        if(err.code === 'NetworkError')
        {
          notification.error({
            message: 'Network Error',
            description: 'Unable to authenticate user due to network error. Please check your network connection and try again.'
          });

          this.setState({ loading: false, buttonText: 'Sign In' });
        }
        else if(err.code === 'UserNotConfirmedException')
        {
          Auth.resendSignUp(this.state.username).catch(err => {
            console.log(err);
            if(err.code === 'LimitExceededException')
            {
              notification.error({
                message: 'Attempt Limit Exceeded',
                description: err.message
              });
            }
          });
          this.setState({
            confirmUser: true
          });
        }
        else if(err.code === 'NotAuthorizedException' && err.message === 'Incorrect username or password.')
        {
          notification.error({
            message: 'Access Error',
            description: err.message + ' Please check your login details and try again.'
          });

          this.setState({ loading: false, buttonText: 'Sign In' });
        }
        else
        {
          notification.error({
            message: 'Unknown Error',
            description: 'Please try to log on again.'
          });

          this.setState({ loading: false, buttonText: 'Sign In' });
        }

        this.setState({
          loading: false,
          buttonText: 'Sign In'
        });
      });

      if(user !== undefined)
      {
        this.setState({
          user
        });

        const userInfo = {
          ...user.attributes,
          username: user.username,
          expiration: moment().add(12, 'hours').toISOString()
          // group: user.signInUserSession.idToken.payload['cognito:groups'][0]
        }

        setUser(userInfo);
        setExpiration(moment().add(12, 'hours').toISOString());
        await this.props.saveUser(userInfo);

        console.log(userInfo);

        if(this.state.user.challengeName === "SOFTWARE_TOKEN_MFA")
        {
          this.setState({
            inputMFA: true,
            buttonText: 'Submit'
          });
        }
        else
        {
          console.log("Navigating to new page...");
          navigate("/app/dashboard");
        }
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
        this.setState({ acceptCode: true });
        // this.props.confirmUser(username);
      }
    }
  }

  render() {
    // if(isLoggedIn()) navigate('/app/dashboard');
    return (
      <div className="login-screen">
        <ExternalHeader />
        {
          !this.state.forgotPassword && !this.state.acceptCode && !this.state.confirmUser && !this.state.inputMFA && (
            <div className="login-form">
              <div className="login-area">
              <div className="login-header">Log in to your Purify account</div>
              {this.state.error.code !== 'NetworkError' && this.state.error && <Error errorMessage={this.state.error}/>}
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
              </div>
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
                <Button type="primary" onClick={this.confirmMFA}>{this.state.buttonText}</Button>
                <Button onClick={this.returnToLogin} type="link">Back to Login <Icon name="arrow-right" /></Button>
              </div>
            </div>
          )
        }
        {
          this.state.forgotPassword && (
            <div className="forgot-password-form">
              <div className="login-area">
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
                <Button type="link" onClick={this.requestPassword}>Send Me Another Code</Button>
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
                <Button onClick={this.confirmUser} type="primary">Submit</Button>
                <Button type="link" onClick={this.resendCode}>Send Me Another Code</Button>
              </div>
            </div>
          )
        }
        <div className="login-image">
          <img src={login} alt="Person entering through door with lock" /> 
        </div>
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
  