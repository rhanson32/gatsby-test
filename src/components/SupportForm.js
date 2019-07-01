import React from 'react';
import { Button, Form, Input } from 'antd';

const { TextArea } = Input;

class DemoForm extends React.Component  {


    handleSubmit = () => {
        console.log("Submitted!")
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <div className="form-field">
              Headline <Input />
              </div>
              <div className="form-field">
              Description
              <TextArea rows={4} />
              </div>
              <div className="form-submit">
              <Button type="primary" onClick={this.handleSubmit}>Submit</Button>
              </div>
            </Form>
        )
    }
}

const SupportForm = Form.create({ name: 'supportForm' })(DemoForm);

export default SupportForm;