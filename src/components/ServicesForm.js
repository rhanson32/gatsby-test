import React from 'react';
import { Checkbox, Form, Row, Col } from 'antd';


class DemoForm extends React.Component  {

    state = {
        allServices: false
    }

    handleSubmit = () => {
        console.log("Submitted!")
    }

    onAllServices = (e) => {
        console.log(e);
        if(e.target.checked)
        {
            this.setState({
                allServices: true
            })
        }
        else
        {
            this.setState({
                allServices: false
            })
        }
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
                        <Checkbox onChange={this.onAllServices} value="all">All Services</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="ec2">EC2</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="rds">RDS</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="s3">S3</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="lambda">Lambda</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="cloudwatch">CloudWatch</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="cloudtrail">CloudTrail</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="cloudformation">CloudFormation</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="ecs">ECS</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="rekognition">Rekognition</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="athena">Athena</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="glue">Glue</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="redshift">Redshift</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="systems-manager">Systems Manager</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="organizations">Organizations</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="config">Config</Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox disabled={this.state.allServices} value="trusted-advisor">Trusted Advisor</Checkbox>
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