import React from "react"
import { navigate } from "@reach/router"
import Error from './Error'
import { Auth } from 'aws-amplify'

const initialState = {
  username: ``,
  password: ``,
  email: '',
  phone_number: '',
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
      const { username, password, email, phone_number, company_name } = this.state
      try {
        await Auth.signUp({ username, password, attributes: { email, phone_number, company_name }})
        this.setState({ stage: 1 })
      } catch (err) {
        this.setState({ error: err })
        console.log('error signing up...', err)
      }
    }

    confirmSignUp = async() => {
        const { username, authCode } = this.state
        try {
          await Auth.confirmSignUp(username, authCode)
          alert('Successfully signed up!')
          navigate("/app/login")
        } catch (err) {
          this.setState({ error: err })
          console.log('error confirming signing up...', err)
        }
      }

      render() {
        return (
          <div className="signup-screen">
            <div className="signup-header">Sign Up</div>
            {
              this.state.stage === 0 && (
                <div className="signup-form">
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
                style={styles.input}
              />
              <input
                onChange={this.handleUpdate}
                placeholder='Email'
                name='email'
                value={this.state.email}
              />
              <input
                onChange={this.handleUpdate}
                placeholder='Phone Number'
                name='phone_number'
                value={this.state.phone_number}
              />
              <input
                onChange={this.handleUpdate}
                placeholder='Company Name'
                name='company_name'
                value={this.state.company_name}
              />
              <div className="signup-button" onClick={this.signUp}>
                <span className="signup-button-text">Sign Up</span>
              </div>
            </div>
          )
        }
        {
          this.state.stage === 1 && (
            <div style={styles.formContainer}>
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

const styles = {
    input: {
      height: 40, margin: '10px 0px', padding: 7
    },
    formContainer: {
      display: 'flex', flexDirection: 'column'
    },
    button: {
      backgroundColor: 'rebeccapurple', padding: '15px 7px', cursor: 'pointer', textAlign: 'center', marginBottom: 10
    },
    buttonText: {
      color: 'white'
    }
  }
  
export default SignUp