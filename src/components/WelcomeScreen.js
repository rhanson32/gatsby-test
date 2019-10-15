import React from 'react';
import { connect} from 'react-redux';
import { updateCustomerStatus, toggleWelcomeScreen, getCurrentUser } from '../actions';
import { Button } from 'antd';
import template from '../../static/PurifyControllerTemplate.png';
import deploy from '../../static/DeployPurifyTemplate.png';
import AWSAccount from './AWSAccount';

class WelcomeScreen extends React.Component {
    state = {
        previewScreen: 'download'
    }

    componentDidMount() {
        this.props.getCurrentUser();
    }

    handleDismiss = () => {
        // this.props.updateCustomerStatus("Active");
        this.setState({ welcomeScreen: false });
        this.props.toggleWelcomeScreen();
    }

    handleSubmit = () => {

        if(this.state.previewScreen === 'download')
        {
            this.setState({
                previewScreen: 'deploy'
            });
        }
        else if(this.state.previewScreen === 'deploy')
        {
            this.setState({
                previewScreen: 'enter'
            });
        }
        else if(this.state.previewScreen === 'enter')
        {
            this.setState({
                welcomeScreen: false,
                previewScreen: 'download'
            });
        }
    }

    render() {
        return (
            <div className="new-account-modal">
                        {
                            this.state.previewScreen === 'download' && (
                                <div className="new-account-modal-content">
                                    <div className="new-account-modal-header">
                                        <h2>
                                            Download the CloudFormation templates
                                        </h2>
                                    </div>
                                    <div className="new-account-modal-main">
                                        <div className="new-account-modal-main-text">
                                            <div>Download the &nbsp;<a href={this.props.user.SignedUrl ? this.props.user.SignedUrl : "#"}>PurifyController</a> &nbsp; CloudFormation template.</div>
                                            <div>Download the &nbsp;<a href="https://s3.amazonaws.com/cloudformation-stackset-sample-templates-us-east-1/AWSCloudFormationStackSetAdministrationRole.yml">AWS CloudFormation StackSet Administration Role</a> &nbsp; template.</div>
                                            <div>Download the &nbsp;<a href="https://s3.amazonaws.com/cloudformation-stackset-sample-templates-us-east-1/AWSCloudFormationStackSetExecutionRole.yml">AWS CloudFormation StackSet Execution Role</a> &nbsp; template.</div>
                                        </div>
                                        <div>
                                            <img width="350" src={template} alt="CloudFormation Template screenshot" />
                                        </div>
                                    </div>
                                    <div className="new-account-modal-footer">
                                        <Button type="danger" onClick={this.handleDismiss}>Dismiss</Button>
                                        <Button type="primary" onClick={this.handleSubmit}>Next</Button>
                                    </div>
                                </div>
                            )
                        }
                        {
                            this.state.previewScreen === 'deploy' && (
                                <div className="new-account-modal-content">
                                    <div className="new-account-modal-header">
                                        <h2>
                                            Deploy the CloudFormation templates 
                                        </h2>
                                    </div>
                                    <div className="new-account-modal-main">
                                        <div className="new-account-modal-main-text">
                                            <div>Deploy the PurifyController template in your AWS Master account.</div>
                                            <div>Deploy the AWSCloudFormationStackSetAdministrationRole template in your AWS Master account.</div>
                                            <div>Deploy the AWSCloudFormationStackSetExecutionRole template in all of your AWS accounts.</div>
                                        </div>
                                        <div>
                                            <img width="350" src={deploy} alt="CloudFormation console" />
                                        </div>
                                    </div>
                                    <div className="new-account-modal-footer">
                                        <Button type="danger" onClick={this.handleDismiss}>Dismiss</Button>
                                        <Button type="primary" onClick={this.handleSubmit}>Next</Button>
                                    </div>
                                </div>
                            )
                        }
                        {
                            this.state.previewScreen === 'enter' && (
                                <div className="new-account-modal-content">
                                    <div className="new-account-modal-header">
                                        <h2>
                                            Enter your AWS Master Account Id
                                        </h2>
                                    </div>
                                    <div className="new-account-modal-main">
                                        {this.props.accounts.length === 0 && <AWSAccount />}
                                        {this.props.accounts.length > 0 && "Thank you for submitting your AWS master account. You may now close this screen."}
                                    </div>
                                    <div className="new-account-modal-footer">
                                        <Button type="primary" onClick={this.handleDismiss}>Finish</Button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        accounts: state.accounts
    }
}

export default connect(mapStateToProps, { updateCustomerStatus, toggleWelcomeScreen, getCurrentUser })(WelcomeScreen);