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
      error: ``
    };
  
    handleSubmit = async e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          if(values.email !== '' && values['group'] !== '')
          {
            if(this.props.users.length < 5 || this.props.user.Plan === 'Standard')
            {
                this.props.addUser(values).then(response => {
                  if(response.statusCode && response.statusCode !== 200)
                  {
                    this.setState({
                      error: response.message
                    })
                  }
                  console.log(response);
              });
            }
              
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
        <div className="add-user-form">
        <Form onSubmit={this.handleSubmit}>
          <div className="add-user-form-internal">
            <div>{this.state.error}</div>
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
            <div className="add-user-form-second-row">
              <Form.Item>
                {getFieldDecorator('group')(
                    <Radio.Group>
                        <Radio value="Administrator">Administrator</Radio>
                        <Radio value="Auditor">Auditor</Radio>
                    </Radio.Group>,
                )}
                </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  Add
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
        </div>
      );
    }
  }

  const mapStateToProps = state => {
    return {
      user: state.user,
      users: state.users
    }
  }

export default Form.create({ name: 'register' })(connect(mapStateToProps, { addUser })(RegistrationForm));

  