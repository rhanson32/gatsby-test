import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'antd';
import { postTicket } from '../actions';

const { TextArea } = Input;

class SupportForm extends React.Component  {

  state = {
    headline: ``,
    description: ``
  }

    handleUpdate = (event) => {
      this.setState({
        [event.target.name]: event.target.value,
      })
    }

    handleSubmit = () => {
        console.log("Submitted!")
        this.props.postTicket(this.state);
        this.props.updateParent();
    }

    render() {
        return (
            <div className="support-ticket-form">
              <h2>Create Support Case</h2>
              <div className="form-field">
                <label>Headline</label> <Input name="headline" value={this.state.headline} onChange={this.handleUpdate} />
              </div>
              <div className="form-field">
              <label>Description</label>
                <TextArea name="description" value={this.state.description} rows={4} onChange={this.handleUpdate} />
              </div>
              <div className="form-submit">
                <Button type="link">Cancel</Button>
                <Button type="primary" onClick={this.handleSubmit}>Submit</Button>
              </div>
            </div>
        )
    }
}

export default connect(null, { postTicket })(SupportForm);