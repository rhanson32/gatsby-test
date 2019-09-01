import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { connect } from 'react-redux';
import { Button, message, Input, notification } from 'antd';
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
  state = {
    discount: '',
    stage: 0,
    buttonText: 'Submit Payment'
  }

  handleChange = ({error}) => {
    if (error) {
      this.setState({errorMessage: error.message});
    }
  };

  handleUpdate = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = async (ev) => {
    // User clicked submit
    ev.preventDefault();
    const { discount } = this.state;
    this.setState({ buttonText: 'Submitting...' });
    const { token } = await this.props.stripe.createToken().catch(err => {
      console.log(err);
      notification.error({
        message: 'Payment Error',
        description: 'Unable to connect with payment provider. Please try again in a few minutes.'
      });
    });

    if(discount === '' || discount === 'ALWAYSFREE' || discount === 'PURIFYFREE')
    {
      if(token)
      {
        const response = await this.props.submitSubscription(token.id, this.props.user, this.state.discount).catch(err => {
          console.log(err);
          notification.error({
            message: 'Subscription Error',
            description: 'Unable to subscribe to plan. Please try again in a few minutes.'
          });
        });
        console.log(response);
        if(response)
        {
          this.setState({
            stage: 1
          });
          
        }
        
      }
      else
      {
        message.error('Unable to process payment. Please refresh the page and try again.');
      }
    }
    else
    {
      message.error('Invalid discount code. Please re-enter code to redeem or clear code input to submit without coupon.');
    }
  }

  render() {
    return (
      <div className="checkout">
        {this.state.stage === 0 && this.props.user && this.props.user.Plan === 'Free' && (
          <div>
          <p style={{ fontWeight: "bold", fontSize: "24px" }}>$299 per month</p>
          <p style={{ fontSize: "20px" }}>Enter credit card details below to complete the purchase</p>
          <CardElement 
              style={{ backgroundColor: "green" }}
              onChange={this.handleChange}
              {...createOptions()}
          />
          <div className="coupon">
            <label>
              Discount Code:
            </label> 
            <Input name="discount" value={this.state.discount} onChange={this.handleUpdate} />
          </div>
          <div className="payment-button">
              <Button style={{ margin: "2rem 0" }} type="primary" onClick={this.handleSubmit}>{this.state.buttonText}</Button>
          </div>
          <p>Your card will be billed monthly until your Purify plan is cancelled. Cancel anytime.</p>
          </div>
        )}
        {
          this.state.stage === 1 && (
            <div className="thank-you-message">
              Thank you for your purchase. Your plan has now been upgraded to Standard.
            </div>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default injectStripe(connect(mapStateToProps, { submitSubscription })(CheckoutForm));