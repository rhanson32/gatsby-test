import React, {Component} from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import LeftMenu from './LeftMenu';
import Header from './Header';

class Payment extends Component {
  render() {
    return (
        <div className="payments-screen">
            <Header />
            <LeftMenu />
      <StripeProvider apiKey="pk_test_Kqcfc50dM018fN5E1HgPe7Ob002W4ops7h">
        <div className="payments">
          <h1>Purchase Standard Plan</h1>
          <Elements>
            <CheckoutForm />
          </Elements>
        </div>
      </StripeProvider>
      </div>
    );
  }
}

export default Payment;