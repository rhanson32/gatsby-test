import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import moment from 'moment';
import { getExpiration } from '../utils/auth';
import CheckoutForm from './CheckoutForm';
import TopMenu from './TopMenu';
import Header from './Header';
import { message } from 'antd';
import { getCurrentUser } from '../actions';

class Payment extends Component {
  componentDidMount = () => {
    if(moment(getExpiration()) < moment())
    {
        console.log("User session has expired");
        message.warning('Your session has expired. Redirecting to login page in 2 seconds.');
        if(user.type !== 'federated')
        {
            setTimeout(async () => {
                await Auth.signOut();
                navigate('/app/login');
            }, 2000); 
        }
        else
        {
            setTimeout(async () => {
                navigate('/app/login');
            }, 2000); 
        }
        
    }
    if(!this.props.user.email)
    {
        this.props.getCurrentUser();
    }
  }

  render() {
    return (
        <div className="payments-screen">
            <Header />
            <TopMenu />
            <div className="payments-main">
              <div className="payments-display">
                <div className="account-details">
                  {
                    this.props.user && (
                      <div>
                         Current subscription: <p>{this.props.user.Plan}</p>
                      </div>
                    )
                  }   
                </div>
                
              
                <StripeProvider apiKey="pk_test_Kqcfc50dM018fN5E1HgPe7Ob002W4ops7h">
                  <div className="payments">
                    {this.props.user && this.props.user.Plan === 'Free' && <h1>Upgrade to Standard</h1>}
                    <Elements>
                      <CheckoutForm />
                    </Elements>
                  </div>
                </StripeProvider>
              </div>
            </div>    
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, { getCurrentUser })(Payment);