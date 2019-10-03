import React from 'react';
import { Card, Button, Modal, Input, Icon, Tag, notification } from 'antd';
import { connect } from 'react-redux';
import { Auth, Storage } from 'aws-amplify';
import AWSAccount from './AWSAccount';
import { Form } from 'tabler-react';
import { testSaml, updateCustomerStatus, downgradeSubscription, addGlobalNotification, removeGlobalNotification, enableSaml, disableSaml, uploadMetadata, enableMFA, disableMFA } from '../actions';
import { navigate } from '@reach/router';
const QRCode = require('qrcode.react');

class TabsCard extends React.Component {
  state = {
    noTitleKey: 'General',
    showKey: false,
    visible: false,
    title: ``,
    oldPassword: ``,
    newPassword: ``,
    showMFASetup: false,
    confirm: false,
    recipient: ``,
    files: [],
    fileUpload: false,
    metadataFile: ``,
    file: null,
    uploadFile: false,
    buttonText: 'Downgrade Subscription'
  };

  componentDidMount = async () => {
      
  }

    showKey = () => {
        this.setState({
            showKey: !this.state.showKey
        });
    }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };

  cancelAccount = async () => {
      await this.props.updateCustomerStatus('Cancelled');
  }

  handleUpdate = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  changePassword = async () => {
      const user = await Auth.currentAuthenticatedUser().catch(err => {
            console.log(err);
            if(err.code === 'NetworkError')
            {
                notification.error({
                    message: 'Network Error',
                    description: 'Unable to retrieve user information due to network error. Please check your network connection and try again.'
                });
            }
      });

      if(user)
      {
        const response = await Auth.changePassword(user, this.state.oldPassword, this.state.newPassword).catch(err => {
            console.log(err);
            if(err.code === 'NetworkError')
            {
                notification.error({
                    message: 'Network Error',
                    description: 'Unable to change password due to network error. Please check your network connection and try again.'
                });
            }
        });

        console.log(response);
        this.setState({ 
            oldPassword: ``,
            newPassword: ``,
            visible: false
        });
      }
        
  }

  cancelPasswordChange = () => {
      this.setState({
          visible: false
      })
  }

  showConfirm = () => {
    this.setState({ confirm: true });
  }

  downgradeAccount = async () => {
      this.setState({ buttonText: 'Working...', confirm: false });
      const response = await this.props.downgradeSubscription();
      if(response)
      {
          notification.success({
              message: 'Operation succeeded.',
              description: 'Account downgraded to Free license.'
          });
      }
      this.setState({ confirm: false });
  }

  cancelDowngrade = () => {
    this.setState({ confirm: false });
  }

  showPlans = () => {
      navigate('/app/payment')
  }

  onClose = () => {
      this.setState({ visible: false });
  }

  showPassword = () => {
      console.log("Change password form.");
      this.setState({
          visible: true,
          title: 'Change Password',
          oldPassword: ``,
          newPassword: ``
      });
  }

  showFileBrowser = () => {
      this.setState({
          uploadFile: true
      });
  }

  onChange = (e) => {
    const file = e.target.files[0];
    console.log(e);
    if(!this.props.settings.Metadata)
    {
        this.props.uploadMetadata(this.props.user.CustomerId + '-metadata.xml');
    }
    Storage.put(this.props.user.CustomerId + '-metadata.xml', file, {
        contentType: 'text/xml'
    })
    .then (result => {
        console.log(result);
        this.setState({
            uploadFile: false
        });
    })
    .catch(err => {
        console.log(err);
        notification.error({
            message: 'Upload Error',
            description: 'Unable to upload metadata. Please verify your network connection and try again.'
        });
    });
    }

  submitMFA = async () => {
    const user = await Auth.currentAuthenticatedUser().catch(err => {
        console.log(err);
        if(err.code === 'NetworkError')
        {
            notification.error({
                message: 'Network Error',
                description: 'Unable to retrieve user information due to network error. Please check your network connection and try again.'
            });
        }
    });
    if(user)
    {
        const response = await Auth.verifyTotpToken(user, this.state.challengeAnswer).catch(err => {
            console.log(err);
            if(err.code === 'NetworkError')
            {
                notification.error({
                    message: 'Network Error',
                    description: 'Unable to verify authentication code due to network error. Please check your network connection and try again.'
                });
            }
        });
        if(response)
        {
            Auth.setPreferredMFA(user, 'TOTP').then(data => {
                this.setState({
                    showMFASetup: false
                });
                notification.success({
                    message: 'MFA Setup Complete',
                    description: 'You may now use MFA to secure this account.'
                });
            }).catch(err => {
                console.log(err);
                if(err.code === 'NetworkError')
                {
                    notification.error({
                        message: 'Network Error',
                        description: 'Unable to set preferred MFA due to network error. Please check your network connection and try again.'
                    });
                }
            });
            Auth.currentAuthenticatedUser().catch(err => {
                console.log(err);
                if(err.code === 'NetworkError')
                {
                    notification.error({
                        message: 'Network Error',
                        description: 'Unable to verify authentication code due to network error. Please check your network connection and try again.'
                    });
                }
            });  
        } 
    }
  }

  cancelMFA = () => {
    this.props.disableMFA();
      this.setState({
          showMFASetup: false
      });
  }

  disableMFA = async () => {
        const user = await Auth.currentAuthenticatedUser().catch(err => {
            console.log(err);
            if(err.code === 'NetworkError')
            {
                notification.error({
                    message: 'Network Error',
                    description: 'Unable to disable MFA due to network error. Please check your network connection and try again.'
                });
            }
        });

        if(user)
        {
            const response = await Auth.setPreferredMFA(user, "NOMFA").catch(err => {
                console.log(err);
                if(err.code === 'NetworkError')
                {
                    notification.error({
                        message: 'Network Error',
                        description: 'Unable to disable MFA due to network error. Please check your network connection and try again.'
                    });
                }
                else
                {
                    notification.error({
                        message: 'Unknown Error',
                        description: 'Unable to disable MFA from your account at this time. Please try again later.'
                    });
                }
            });
            if(response)
            {
                console.log("Disabled MFA");
                this.props.disableMFA();
            }
        }
  }

  enableSaml = async () => {
    this.props.enableSaml();
  }

  disableSaml = async () => {
    this.props.disableSaml();
  }

  setupMFA = async () => {

      const user = await Auth.currentAuthenticatedUser().catch(err => {
            console.log(err);
            if(err.code === 'NetworkError')
            {
                notification.error({
                    message: 'Network Error',
                    description: 'Unable to start MFA setup process due to network error. Please check your network connection and try again.'
                });
            }
      });
      
      if(user)
      {
            const response = await Auth.setupTOTP(user).catch(err => {
                console.log(err);
                if(err.code === 'NetworkError')
                {
                    notification.error({
                        message: 'Network Error',
                        description: 'Unable to verify MFA setup due to network error. Please check your network connection and try again.'
                    });
                }
                else
                {
                    notification.error({
                        message: 'Unknown Error',
                        description: 'Unable to link MFA to your account at this time. Please try again later.'
                    });
                }
            });
            if(response)
            {
                this.setState({
                    mfaCode: response
                });
                const issuer = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_wMiZuxWyI';
                const str = "otpauth://totp/AWSCognito:"+ this.props.user.sub + "?secret=" + this.state.mfaCode + "&issuer=" + issuer;
                this.setState({
                    qrCode: str,
                    showMFASetup: true
                });
                this.props.enableMFA();
            }
      }
  }

    submitNotification = () => {
        if(!this.props.settings.Notifications.includes(this.state.recipient) && this.state.recipient.includes('@'))
        {
            this.props.addGlobalNotification(this.state.recipient);
            this.setState({
                recipient: ``
            });
        }   
        else if(this.props.settings.Notifications.includes(this.state.recipient))
        {
            console.log("Invalid entry");
            notification.warning({
                message: 'Duplicate Entry',
                description: 'User is already set up to be notified.'
            });
        }
        else if(!this.state.recipient.includes('@') || !this.state.recipient.includes('.'))
        {
            notification.error({
                message: 'Invalid Format',
                description: 'Please verify the format of your entry to include an email address.'
            });
        }
    } 

    deleteNotification = (tag) => {
        this.props.removeGlobalNotification(tag);
    }

  render() {
    const tabListNoTitle = [
        {
          key: 'General',
          tab: 'General',
        },
        {
          key: 'AWS',
          tab: 'AWS',
        },
        {
            key: 'SSO',
            tab: 'SSO'
        }
      ];
      
      const contentListNoTitle = {
        General: <div>
            <div className="settings-row">
                <div className="settings-header">
                    Subscription Status 
                </div>
                <div className="settings-subscription">
                    <div className="settings-lines">
                    <div className="settings-left-header">Current Plan:</div> {this.props.user.Plan}
                        {this.props.user.Plan === "Free" && this.props.user.Group && this.props.user.Group.includes('Administrators') && <Button type="link" onClick={this.showPlans}> <Icon type="arrow-up" /> Upgrade </Button>}
                        {this.props.user.Plan !== "Free" && this.props.user.Group && this.props.user.Group.includes('Administrators') && (
                            <Button type="link" onClick={this.showConfirm}>
                                {this.state.buttonText}
                            </Button>
                        )} 
                        <Button type="link" onClick={this.cancelAccount}>Cancel Account</Button>     
                    </div>
                </div>
            </div>
            {
                this.props.user.Type === 'Native' && (
                    <div className="settings-row">
                        <div className="settings-header"> 
                            Credentials
                        </div>
                        <div className="settings-subscription">
                            <div className="settings-lines">
                            <div className="settings-left-header">Password:</div> 
                                {!this.state.visible && <Button type="link" onClick={this.showPassword}><Icon type="key" />Change Password</Button>}
                            </div>
                            <div className="settings-lines">
                            <div className="settings-left-header">MFA Status:</div> {this.props.user.MFA ? 'Enabled' : 'Disabled'}
                                {!this.props.user.MFA && !this.state.visible && <Button type="link" onClick={this.setupMFA}>Set up MFA</Button>}
                                {this.props.user.MFA && <Button type="link" onClick={this.disableMFA}> <Icon type="x" /> Disable MFA</Button>}
                            </div>
                            <Modal
                                visible={this.state.showMFASetup}
                                onOk={this.submitMFA}
                                onCancel={this.cancelMFA}
                                closable={false}
                            >
                                <div className="mfa-setup">
                                    <div className="mfa-setup-title">
                                        MFA Setup
                                    </div>
                                    <div className="mfa-setup-description">
                                        Use the QR Code below to set up MFA in your favorite authenticator app.
                                    </div>
                                    <div className="mfa-qr">
                                        <QRCode value={this.state.qrCode} />
                                    </div>
                                    <label>Authenticator Code</label>
                                    <Input name="challengeAnswer" value={this.state.challengeAnswer} onChange={this.handleUpdate} />
                                </div>
                            </Modal>
                        </div>
                        {
                            this.state.visible && (
                                <div className="change-password-form">
                                    <div className="change-password-form-item">
                                        <label>Old Password</label>
                                        <Input name="oldPassword" value={this.state.oldPassword} onChange={this.handleUpdate} />
                                    </div>
                                    <div className="change-password-form-item">
                                        <label>New Password</label>
                                        <Input name="newPassword" value={this.state.newPassword} onChange={this.handleUpdate} />
                                    </div>
                                    <div className="change-password-form-buttons">
                                    <Button type="primary" onClick={this.changePassword}>
                                        Submit
                                    </Button>
                                    <Button type="danger" onClick={this.cancelPasswordChange}>
                                        Cancel
                                    </Button>
                                    </div>
                                </div>
                            )
                        }
                        
                    </div>
                )
            }
            <div className="settings-row">
                <div className="settings-header">
                    Global Alert Notifications
                </div>
                <div className="settings-subscription">
                    <div className="settings-notifications">
                        <div className="settings-left-header">
                            Recipients:
                        </div>
                        <div className="notification-group">
                            {this.props.settings.Notifications && this.props.settings.Notifications.length === 0 && 'None' }
                            {
                                this.props.settings.Notifications.map((notification, index) => {
                                    return (
                                        <Tag color="blue" key={index} closable onClose={() => this.deleteNotification(notification)}>
                                            {notification}
                                        </Tag>
                                    )
                                })
                            }
                            <div className="notifications-modify">
                                <div className="add-notifications">
                                    <Input placeholder="email@company.com" name="recipient" value={this.state.recipient} onChange={this.handleUpdate} /> 
                                    <Button type="primary" onClick={this.submitNotification}>
                                        <Icon style={{ fontWeight: "700" }} type="plus" /> Add
                                    </Button>  
                                </div> 
                            </div>
                        </div> 
                        
                    </div>                  
                </div>
            </div>
        </div>,
        AWS: <div>
            {!this.props.scanComplete && 'Loading account data...'}
        {
            this.props.scanComplete && this.props.accounts.length === 0 && this.props.accountsError === '' && (
                <div className="aws-settings-title">
                    Enter the details of your AWS Master account, and we will automatically discover the rest of your AWS accounts.
                </div>
            )
        }
        {this.props.scanComplete && this.props.accountsError !== '' && this.props.accountsError}
        {this.props.scanComplete && this.props.accounts.length === 0 && this.props.accountsError === '' && <AWSAccount />} 
        {
            this.props.accounts.find(account => account.Type === 'Master') && (
                <div className="settings-row">
                    <div className="settings-header">AWS Master Account</div>
                    <div className="settings-subscription">
                        <div className="settings-lines"><div className="settings-left-header">Master Account: </div><div>{this.props.accounts.find(account => account.Type === 'Master').AccountId || "Not Found"}</div></div>
                        <div className="settings-lines"><div className="settings-left-header">Account Status: </div><div>{this.props.accounts.find(account => account.Type === 'Master').Status || "Not Found"}</div></div>
                        <div className="settings-lines"><div className="settings-left-header">Role Name: </div><div>{this.props.accounts.find(account => account.Type === 'Master').RoleName || "Not Found"}</div></div>
                    </div>
                </div>
            )
        } 
        {
            this.props.accounts.find(account => account.Type === 'Master') && (
                <div className="settings-row">
                    <div className="settings-header">AWS External Id</div>
                    <div className="settings-subscription">
                        <div className="settings-lines"><div className="settings-left-header">External ID: </div><div>{this.props.settings.ExternalId || "Not Found"}</div></div>
                    </div>
                </div>
            )
        } 
        {/* <div className="settings-row">
            <RegionsForm />
        </div>  
        <div className="settings-row">
            <ServicesForm />
        </div>   */}
      </div>,
      SSO: <div>
      {
          this.props.scanComplete && !this.props.settings.saml && (
              <div className="settings-row">
                <div className="settings-header">
                    Single Sign-On
                </div>
                <div className="settings-subscription">
                    <div className="settings-lines">
                        <div className="settings-left-header">SSO Status: </div>Disabled
                        <Button type="link" onClick={this.enableSaml}>
                            <Icon type="x" style={{ color: "red", fontSize: "30px" }} />
                            Enable SSO
                        </Button>
                    </div>
                </div>
              </div>
          )
      }
      {
          this.props.scanComplete && this.props.settings.saml && (
              <div className="settings-row">
                <div className="settings-header">
                    Single Sign-On
                </div>
                <div className="settings-subscription">
                    <div className="settings-lines">
                        <div className="settings-left-header">SSO Status: </div> Enabled
                        <div className="settings-sso-status">
                            <Button type="link" onClick={this.disableSaml}>
                                Disable SSO
                            </Button>
                        </div>
                    </div>
                    <div className="settings-lines">
                        <div className="settings-left-header">Metadata File:</div> None 
                        <div className="metadata-upload">
                            <Form.FileInput onChange={(e) => this.onChange(e)} />
                        </div>
                    </div>
                </div>
              </div>
          )
      }
      {
          this.props.scanComplete && this.props.settings.saml && this.state.uploadFile && (
              <div className="settings-row">
                <div className="settings-header">
                    Upload Metadata File
                </div>
                <div className="settings-subscription">
                    <div className="metadata-upload">
                        <Form.FileInput onChange={(e) => this.onChange(e)} />
                    </div>
                </div>
              </div>
          )
      }
      {
          this.props.scanComplete && this.props.settings.saml && this.props.settings.Metadata && !this.state.uploadFile && (
              <div className="settings-row">
                <div className="settings-header">
                    Metadata File Status
                </div>
                <div className="settings-subscription">
                    <div className="metadata-upload">
                        <Icon type="check" style={{ color: "green", fontSize: "30px" }} /> Metadata.xml <Button type="link" onClick={this.showFileBrowser}>Upload new file</Button>
                    </div>
                </div>
              </div>
          )
      }
      {
          this.props.scanComplete && this.props.settings.saml && this.props.settings.Metadata && !this.state.uploadFile && (
              <div className="settings-row">
                <div className="settings-header">
                    SSO Link
                </div>
                <div className="settings-subscription">
                    {this.props.user && this.props.user.CustomerId && <a href={`https://auth.purify.cloud/login?response_type=code&client_id=${this.props.user.Client}&redirect_uri=https://purify.cloud/app/saml?client_id=${this.props.user.Client}`} target="_blank" rel="noopener noreferrer">{`https://auth.purify.cloud/login?response_type=code&client_id=${this.props.user.Client}&redirect_uri=https://purify.cloud/app/saml?client_id=${this.props.user.Client}`}</a>}
                </div>
              </div>
          )
      }
       {
          this.props.scanComplete && this.props.settings.saml && (
              <div className="settings-row">
                <div className="settings-header">
                    Single Sign-On Configuration Instructions
                </div>
                <div className="settings-subscription">
                    <div className="settings-lines">
                        <div className="settings-left-header">&nbsp;</div>
                        <div className="settings-sso-status">
                            <ol>
                                <li>Create an Enterprise Application in Azure AD.</li>
                                <li>Configure following values in Single Sign-On:
                                    <ul>
                                        <li>Entity ID: urn:amazon:cognito:sp:us-east-1_wMiZuxWyI</li>
                                        <li>Reply URL: https://auth.purify.cloud/saml2/idpresponse</li>
                                        <li>Sign On URL: {`https://auth.purify.cloud/login?response_type=code&client_id=${this.props.user.Client}&redirect_uri=https://purify.cloud/app/saml?client_id=${this.props.user.Client}`}</li>
                                        <li>Relay State: https://purify.cloud/app/saml</li>
                                    </ul>
                                </li>
                                <li>Make sure you have a claim with Name of http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress that is a unique identifier in your organization. Email address works well for this value (e.g. user.mail in Azure AD)</li>
                                <li>Download the federation metadata.</li>
                                <li>Upload the metadata in this menu (see file uploader above).</li>
                                <li>Test out your SSO configuration using the SSO link provided above.</li>
                                <li>If you have issues, contact support@purify.cloud for additional support.</li>
                            </ol>
                        </div>
                    </div>
                    <div className="settings-lines">
                        <div className="settings-left-header">&nbsp;</div> 
                        <div className="metadata-upload">
                            &nbsp;
                        </div>
                    </div>
                </div>
              </div>
          )
      }
    </div>
      };

    return (
        <div className="settings-div">
            {this.props.user && this.props.user.Type && (<Card
                style={{ width: '100%', minHeight: "60vh", boxShadow: "0 0 8px 2px #ddd", borderRadius: "3px" }}
                tabList={tabListNoTitle}
                activeTabKey={this.state.noTitleKey}
                onTabChange={key => {
                    this.onTabChange(key, 'noTitleKey');
                }}
                >
                    {contentListNoTitle[this.state.noTitleKey]}
                </Card>
            )}
            <Modal
               visible={this.state.confirm}
               closable={false}
               footer={[
                   <div>
                <Button onClick={this.cancelDowngrade}>
                    Cancel
                </Button>
                <Button type="danger" onClick={this.downgradeAccount}>
                    Confirm
                </Button>
                </div>
               ]}
            >
              Are you sure you want to downgrade to the Free plan?
            </Modal>
        </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        settings: state.settings,
        user: state.user
    }
}

export default connect(mapStateToProps, { testSaml, updateCustomerStatus, addGlobalNotification, removeGlobalNotification, downgradeSubscription, enableSaml, disableSaml, uploadMetadata, enableMFA, disableMFA })(TabsCard);