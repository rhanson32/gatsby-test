import React from "react"

import { navigate } from '@reach/router'
import { setUser, isLoggedIn } from '../utils/auth'
import { connect } from 'react-redux'
import Error from './Error'
import { Auth } from 'aws-amplify'
import { saveUser } from '../actions'
import ExternalHeader from './ExternalHeader'

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

  login = async() => {
    const { username, password } = this.state
    try {
      await Auth.signIn(username, password)
      const user = await Auth.currentAuthenticatedUser()
      console.log(user);
      
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
        {this.state.error && <Error errorMessage={this.state.error}/>}
        <div className="login-form">
          <div className="login-header">PurifyCloud</div>
          {this.state.error && <Error errorMessage={this.state.error}/>}
         <input
            onChange={this.handleUpdate}
            placeholder='Username'
            name='username'
            value={this.state.username}
          />
          <input
            onChange={this.handleUpdate}
            placeholder='Password'
            name='password'
            value={this.state.password}
            type='password'
          />
          <div className="login-button" onClick={this.login}>
            <span className="login-button-text">Sign In</span>
          </div>
        </div>
      </div>
    )
  }
}
  
export default connect(null, { saveUser })(Login)
  