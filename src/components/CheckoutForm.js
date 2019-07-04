import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import { Button } from 'antd';
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
  constructor(props) {
    super(props);
  }

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
    const response = await submitSubscription(token.id);
    console.log(response);

  }

  render() {
    return (
      <div className="checkout">
        <p>Would you like to complete the purchase?</p>
        <CardElement 
            style={{ backgroundColor: "green" }}
            onChange={this.handleChange}
            {...createOptions()}
        />
        <Button type="primary" onClick={this.handleSubmit}>Submit Payment</Button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);