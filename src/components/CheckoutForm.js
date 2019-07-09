import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { connect } from 'react-redux';
import { Button, message } from 'antd';
import { submitSubscription } from '../actions';

const createOptions = () => {
    return {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          fontFamily: 'Open Sans, sans-serif',
          letterSpacing: '0.025em',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#c23d4b',
        },
      }
    }
  };

class CheckoutForm extends Component {

  handleChange = ({error}) => {
    if (error) {
      this.setState({errorMessage: error.message});
    }
  };

  handleSubmit = async (ev) => {
    // User clicked submit
    ev.preventDefault();
    console.log(this.props);
    console.log("Submitting!");
    const { token } = await this.props.stripe.createToken();

    console.log(token);
    if(token)
    {
      const response = await submitSubscription(token.id, this.props.user);
      console.log(response);
    }
    else
    {
      message.error('Unable to process payment. Please refresh the page and try again.');
    }
  }

  render() {
    return (
      <div className="checkout">
        <p style={{ fontWeight: "bold", fontSize: "24px" }}>$99 per month (limited time only)</p>
        <p style={{ fontSize: "20px" }}>Enter credit card details below to complete the purchase</p>
        <CardElement 
            style={{ backgroundColor: "green" }}
            onChange={this.handleChange}
            {...createOptions()}
        />
        <Button style={{ margin: "2rem 0" }} type="primary" onClick={this.handleSubmit}>Submit Payment</Button>
        <p>Your card will be billed monthly until your Purify plan is cancelled. Cancel anytime.</p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default injectStripe(connect(mapStateToProps, null)(CheckoutForm));