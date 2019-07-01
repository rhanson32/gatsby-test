import React from 'react';
import { Checkbox, Form, Row, Col } from 'antd';


class DemoForm extends React.Component  {

    handleSubmit = () => {
        console.log("Submitted!")
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item label="Allowed AWS Regions">
                    {getFieldDecorator('checkbox-group', {
                    initialValue: ['A', 'B'],
                })(
                    <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                        <Col span={8}>
                        <Checkbox value="all">All Regions</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="us-east-1">U.S. East 1 (N. Virginia)</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="us-east-2">U.S. East 2 (Ohio)</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="us-west-1">U.S. West 1 (N. California)</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="us-west-2">U.S. West 2 (Oregon)</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="ap-east-1">Asia Pacific (Hong Kong)</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="ap-south-1">Asia Pacific (Mumbai)</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="ap-northeast-1">Asia Pacific (Tokyo)</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="ap-northeast-2">Asia Pacific (Seoul)</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="ap-southeast-1">Asia Pacific (Singapore)</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="ap-southeast-2">Asia Pacific (Sydney)</Checkbox>
                        </Col>
                    </Row>
                    </Checkbox.Group>,
                )}
                </Form.Item>
            </Form>
        )
    }
}

const RegionsForm = Form.create({ name: 'regionsForm' })(DemoForm);

export default RegionsForm;