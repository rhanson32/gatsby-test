import React from "react"
import { navigate } from "@reach/router"
import { connect } from 'react-redux';
import { setUser, setExpiration } from '../utils/auth';
import { saveUser } from '../actions';
import Error from './Error'
import { Auth } from 'aws-amplify'
import { validateCompany, putUserAdmin } from '../actions';
import ExternalHeader from './ExternalHeader';
import { Input, Button, notification } from 'antd';
import moment from 'moment';
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
  
    signUp = async () => {
      this.setState({ loading: true, buttonText: 'Creating Account...' });
      const { password, email, company } = this.state;
      let response;
      let signUpResponse;
      try {
        this.setState({ error: null });
        response = await validateCompany(this.state).catch(err => console.log(err));
        if(response && response.statusCode !== 200)
        {
          this.setState({ error: { message: response.error }, loading: false, buttonText: 'Sign Up' })
        }
        else
        {
          signUpResponse = await Auth.signUp({ username: email, password, attributes: { email, "custom:company" : company.replace(/ /g, '-') }}).catch(err => {
            console.log(err);
            if(err.code === 'UsernameExistsException')
            {
              this.setState({
                error: { message: 'Username already exists. Please use a unique email to sign up.' }
              });
            }
            else
            {
              this.setState({
                error: 'An error occurred. Please try again.'
              });
            }
            this.setState({ loading: false, buttonText: 'Sign Up' });
          });
          console.log("Sign Up Response:", signUpResponse);

          this.props.putUserAdmin(signUpResponse.userSub, this.state.company);

          this.setState({ stage: 1, buttonText: 'Confirm Sign Up' });
          notification.success({
            message: 'Account Created',
            description: 'Account created successfully.'
          });
        }
      } catch (err) {
        this.setState({ 
          error: err,
          loading: false
        });
      }
    }

    confirmSignUp = async() => {
        const { email, authCode, password } = this.state;
        let user;
        this.setState({ buttonText: 'Confirming code...' });
        try {
          const confirmResponse = await Auth.confirmSignUp(email, authCode).catch(err => {
            console.log(err);
              notification.error({
                message: err.name,
                description: err.message
              });
          });

          if(confirmResponse)
          {
              notification.success({
                message: 'Account confirmed',
                description: 'Account has been confirmed. Now attempting to log in...'
              });

              user = await Auth.signIn(email, password).catch(err => {
                console.log(err);
                if(err.code === 'NetworkError')
                {
                  notification.error({
                    message: 'Network Error',
                    description: 'Unable to authenticate user due to network error. Please check your network connection and try again.'
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
              });
    
              this.setState({
                loading: false,
                buttonText: 'Sign In'
              });
          }
          
          
          console.log(user);

          if(user !== undefined)
          {

            const userInfo = {
              ...user.attributes,
              username: user.username,
              expiration: moment().add(12, 'hours').toISOString()
            }

            setUser(userInfo);
            setExpiration(moment().add(12, 'hours').toISOString());
            await this.props.saveUser(userInfo);

            console.log(userInfo);

            setTimeout(async () => {
              navigate('/app/dashboard');
            }, 1000); 
          }
          else
          {
              setTimeout(async () => {
                navigate('/app/login');
            }, 1000); 
          }
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
              {this.state.error && <Error errorMessage={this.state.error} />}
              <div className="confirm-header">
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
                {this.state.buttonText}
              </Button>
              <Button type="link">
                Send me another code
              </Button>
            </div>
          )
        }
        <div className="login-image">
          <img src={welcome} alt="Person entering through a door" />
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
  
export default connect(mapStateToProps, { saveUser, putUserAdmin })(SignUp);