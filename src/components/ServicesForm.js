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
                <Form.Item label="Allowed AWS Services">
                    {getFieldDecorator('checkbox-group', {
                    initialValue: ['A', 'B'],
                })(
                    <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                        <Col span={8}>
                        <Checkbox value="all">All Services</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="ec2">EC2</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="rds">RDS</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="s3">S3</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="lambda">Lambda</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="cloudwatch">CloudWatch</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="cloudtrail">CloudTrail</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="cloudformation">CloudFormation</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="ecs">ECS</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="rekognition">Rekognition</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="athena">Athena</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="glue">Glue</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="redshift">Redshift</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="systems-manager">Systems Manager</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="organizations">Organizations</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="config">Config</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value="trusted-advisor">Trusted Advisor</Checkbox>
                        </Col>
                    </Row>
                    </Checkbox.Group>,
                )}
                </Form.Item>
            </Form>
        )
    }
}

const ServicesForm = Form.create({ name: 'servicesForm' })(DemoForm);

export default ServicesForm;