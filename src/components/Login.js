import React from "react"

import { navigate } from '@reach/router'
import { setUser, isLoggedIn } from '../utils/auth'
import { connect } from 'react-redux'
import Error from './Error'
import { Auth } from 'aws-amplify'
import { saveUser } from '../actions'
import ExternalHeader from './ExternalHeader';
import MobileMenu from './MobileMenu';

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
    if (isLoggedIn()) navigate('/app/dashboard')
    return (
      <div className="login-screen">
        <ExternalHeader />
        {this.props.mobile.mobileMenu && <MobileMenu />}
        <div className="login-form">
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
          <div className="login-button" onClick={this.login}>
            <span className="login-button-text">Sign In</span>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
      mobile: state.mobile
  }
}
  
export default connect(mapStateToProps, { saveUser })(Login)
  