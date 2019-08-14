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
import { Alert, message } from 'antd';
import { getCurrentUser } from '../actions';

class Payment extends Component {
  componentDidMount = () => {
    if(moment(getExpiration()) < moment())
        {
            console.log("User session has expired");
            message.warning('Your session has expired. Redirecting to login page in 2 seconds.');
            setTimeout(async () => {
                await Auth.signOut();
                navigate('/app/login');
            }, 2000); 
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
              <div>
                Current subscription: {this.props.user.Plan}
              </div>
              <Alert
                message="Upgrade to Standard today!"
                description="Fill out the form below to begin using our Standard plan today. Remove all restrictions from your Purify account, so that unlimited rules can be managed and unlimited users can view/edit your account."
                type="info"
                showIcon
                closable
                style={{ width: "80%", margin: "2rem auto" }}
              />
              <StripeProvider apiKey="pk_test_Kqcfc50dM018fN5E1HgPe7Ob002W4ops7h">
                <div className="payments">
                  <h1>Upgrade to Standard</h1>
                  <Elements>
                    <CheckoutForm />
                  </Elements>
                </div>
              </StripeProvider>
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