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
    error: ``
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
    console.log(this.props);
    if (isLoggedIn()) navigate('/app/dashboard');
    return (
      <div className="login-screen">
        <ExternalHeader />
        <div className={this.props.mobileMenu ? "login-form mobile-menu-showing" : "login-form mobile-menu-hidden"}>
          <div className="login-header">PurifyCloud</div>
          {this.state.error && <Error errorMessage={this.state.error}/>}
         <input
            onChange={this.handleUpdate}
            placeholder='Email'
            name='username'
            value={this.state.username}
            onKeyPress={this.handleKeyPress}
          />
          <input
            onChange={this.handleUpdate}
            placeholder='Password'
            name='password'
            value={this.state.password}
            type='password'
            onKeyPress={this.handleKeyPress}
          />
          <button className="login-button" onClick={this.login}>
            <span className="login-button-text">Sign In</span>
          </button>
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
  