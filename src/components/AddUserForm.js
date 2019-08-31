import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Input,
    Radio,
    Button
  } from 'antd';
  import { addUser } from '../actions';
  
  class RegistrationForm extends React.Component {
    state = {
      confirmDirty: false
    };
  
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          if(values.email !== '' && values['group'] !== '')
          {
              this.props.addUser(values);
          }
        }
      });
    };
  
    render() {
      const { getFieldDecorator } = this.props.form;
  
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
  
      return (
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="Email">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'Email format is not valid',
                },
                {
                  required: true,
                  message: 'Please input your Email!',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Role">
            {getFieldDecorator('group')(
                <Radio.Group>
                    <Radio value="Administrator">Administrator</Radio>
                    <Radio value="Auditor">Auditor</Radio>
                </Radio.Group>,
            )}
            </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }
  
export default Form.create({ name: 'register' })(connect(null, { addUser })(RegistrationForm));

  