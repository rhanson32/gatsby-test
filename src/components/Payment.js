import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import moment from 'moment';
import { getExpiration } from '../utils/auth';
import CheckoutForm from './CheckoutForm';
import credit from '../../static/undraw_Credit_card.svg';
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
        if(this.props.user.type !== 'federated')
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
                {/* <div className="account-details">
                  {
                    this.props.user && (
                      <div>
                         Current subscription: {this.props.user.Plan}
                      </div>
                    )
                  }   
                </div> */}
                
              
                <StripeProvider apiKey="pk_test_Kqcfc50dM018fN5E1HgPe7Ob002W4ops7h">
                  <div className="payments">
                    {this.props.user && this.props.user.Plan === 'Free' && <h1>Standard License</h1>}
                    <Elements>
                      <CheckoutForm />
                    </Elements>
                  </div>
                </StripeProvider>
              </div>
              <div className="payment-image">
                <img src={credit} />
                <div>
                  <p>Enjoy all of the benefits of the Standard license, including:</p>
                  <ul>
                    <li>Unlimited rules</li>
                    <li>Multiple cloud providers</li>
                    <li>Unlimited cloud accounts</li>
                    <li>SAML-based SSO (Active Directory supported)</li>
                    <li>Audit Trail</li>
                    <li>Automated remediation (where supported)</li>
                  </ul>
                </div>
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