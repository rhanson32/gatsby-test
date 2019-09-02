import React from 'react';
import { Card, Table, Button, Modal, Input, Icon, Drawer, Tag, Tooltip, notification, message } from 'antd';
import { connect } from 'react-redux';
import { Auth, Storage } from 'aws-amplify';
import AWSAccount from './AWSAccount';
import { Form } from 'tabler-react';
import { testSaml, updateCustomerStatus, downgradeSubscription, addGlobalNotification, removeGlobalNotification, enableSaml, disableSaml, uploadMetadata } from '../actions';
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
            newPassword: ``
        });
      }
        
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
    Storage.put(this.props.user.CustomerId + '-metadata.xml', file, {
        contentType: 'text/xml'
    })
    .then (result => {
        console.log(result);
        this.setState({
            uploadFile: false
        })
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
                console.log(data);
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
            Auth.currentAuthenticatedUser().then(data => console.log(data)).catch(err => {
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
      this.setState({
          showMFASetup: false
      })
  }

  disableMFA = async () => {
      console.log('Test');
  }

  enableSaml = async () => {
    this.props.enableSaml();
  }

  disableSaml = async () => {
    this.props.disableSaml();
  }

  setupMFA = async () => {
      console.log("Clicked!");
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
    console.log(this.props);
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

      const dataSource = this.props.accounts.map((account, index) => {
        return {
            key: (index + 1).toString(),
            accountId: account.AccountId,
            provider: account.Provider,
            roleName: account.RoleName,
            status: account.Status,
            type: account.Type
        }
    });
      
      const columns = [
          {
              title: 'Master Account Id',
              dataIndex: 'accountId',
              key: 'accountId'
          },
          {
              title: 'Provider',
              dataIndex: 'provider',
              key: 'provider'
          },
          {
              title: 'Status',
              dataIndex: 'status',
              key: 'status'
          },
          {
              title: 'Role',
              dataIndex: 'roleName',
              key: 'roleName'
          }
      ];

      const webColumns = [
        {
            title: 'Master Account Id',
            dataIndex: 'accountId',
            key: 'accountId'
        },
        {
            title: 'Role',
            dataIndex: 'roleName',
            key: 'roleName'
        }
    ];
      
      const contentListNoTitle = {
        General: <div>
            <div className="settings-row">
                <div className="settings-left-side">
                    Subscription  
                </div>
                <div className="settings-subscription">
                    <div className="settings-buttons">
                    {this.props.user.Plan === "Free" && this.props.user.Group.includes('Administrators') && <Button type="primary" size="large" onClick={this.showPlans} block>Upgrade Subscription</Button>}
                    {this.props.user.Plan === "Free" && !this.props.user.Group.includes('Administrators') && <Button type="primary" disabled size="large" onClick={this.showPlans} block>Upgrade Subscription</Button>}
                    {this.props.user.Plan !== "Free" && (
                        <Button type="danger" size="large" onClick={this.showConfirm} block>
                            {this.state.buttonText}
                        </Button>
                    )}   
                    <Button type="danger" size="large" onClick={this.showConfirm} block>
                        Cancel Subscription
                    </Button>      
                    </div>
                </div>
            </div>
            <hr style={{ width: "80%", margin: "2rem auto" }} />
            {
                this.props.user.Type === 'Native' && (
                    <div className="settings-row">
                        <div className="settings-left-side"> 
                            Credentials
                        </div>
                        <div className="settings-subscription">
                            <div className="settings-buttons">
                            <Button type="primary" size="large" onClick={this.showPassword}>Change Password</Button>
                            {!this.props.user.MFA && <Button type="primary" size="large" onClick={this.setupMFA}>Set up MFA</Button>}
                            {this.props.user.MFA && <Button type="primary" size="large" onClick={this.disableMFA}>Disable MFA</Button>}
                            </div>
                            <Modal
                                visible={this.state.showMFASetup}
                                onOk={this.submitMFA}
                                onCancel={this.cancelMFA}
                            >
                                <QRCode value={this.state.qrCode} />
                                <label>Authenticator Code</label>
                                <Input name="challengeAnswer" value={this.state.challengeAnswer} onChange={this.handleUpdate} />
                            </Modal>
                        </div>
                    </div>
                )
            }
            
            {this.props.user.Type === 'Native' && <hr style={{ width: "80%", margin: "2rem auto" }} />}
            <div className="settings-row">
                <div className="settings-left-side">
                    <Tooltip title="Add email addresses to receive notifications for all new violations of all enabled rules.">
                        Global Notification Emails
                    </Tooltip> 
                </div>
                <div className="settings-subscription">
                    <div className="notification-group">
                    {this.props.settings.Notifications.length === 0 && this.props.scanComplete && 'None' }
                    {
                        this.props.settings.Notifications.map((notification, index) => {
                            return (
                                <Tag color="blue" key={index} closable onClose={() => this.deleteNotification(notification)}>
                                    {notification}
                                </Tag>
                            )
                        })
                    }
                    </div>
                    <div className="add-notifications">
                    <Input name="recipient" value={this.state.recipient} onChange={this.handleUpdate} /> 
                    <Button type="primary" onClick={this.submitNotification}>
                        <Icon style={{ fontWeight: "700" }} type="plus" /> Add
                    </Button>  
                    </div> 
                </div>
            </div>
        </div>,
        AWS: <div>
            {!this.props.scanComplete && 'Loading account data...'}
        {
            this.props.scanComplete && this.props.accounts.length === 0 && this.props.accountsError === '' && (
                <div className="settings-card-title">
                    Enter the details of your AWS Master account, and we will automatically discover the rest of your AWS accounts.
                </div>
            )
        }
        {this.props.scanComplete && this.props.accountsError !== '' && this.props.accountsError}
        {this.props.scanComplete && this.props.accounts.length === 0 && this.props.accountsError === '' && <AWSAccount />} 
        {
            this.props.accounts.find(account => account.Type === 'Master') && (
                <div className="settings-row">
                    <div className="account-list">
                        <div className="web-accounts">
                            <Table style={{ border: "1px solid #CCC", borderRadius: "3px" }} pagination={false} dataSource={dataSource.filter(source => source.type === 'Master')} columns={columns} />
                        </div>
                        <div className="mobile-accounts">
                            <Table style={{ border: "1px solid #CCC", borderRadius: "3px" }} pagination={false} dataSource={dataSource.filter(source => source.type === 'Master')} columns={webColumns} />
                        </div>
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
                <div className="settings-left-side">
                    SSO Status
                </div>
                <div className="settings-subscription">
                    <Icon type="x" style={{ color: "red", fontSize: "30px" }} />
                    <Button type="link" onClick={this.enableSaml}>
                        Enable SSO
                    </Button>
                </div>
              </div>
          )
      }
      {
          this.props.scanComplete && this.props.settings.saml && (
              <div className="settings-row">
                <div className="settings-left-side">
                    SSO Status
                </div>
                <div className="settings-subscription">
                    <div className="settings-sso-status">
                    <Icon type="check" style={{ color: "green", fontSize: "30px" }} />
                    <Button type="link" onClick={this.disableSaml}>
                        Disable SSO
                    </Button>
                    </div>
                </div>
              </div>
          )
      }
      {
          this.props.scanComplete && this.props.settings.saml && this.state.uploadFile && (
              <div className="settings-row">
                <div className="settings-left-side">
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
          this.props.scanComplete && this.props.settings.saml && !this.state.uploadFile && (
              <div className="settings-row">
                <div className="settings-left-side">
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
    </div>
      };

    return (
        <div className="settings-div">
            <Card
            style={{ width: '100%', minHeight: "60vh", border: "1px solid #CCC", borderRadius: "3px" }}
            tabList={tabListNoTitle}
            activeTabKey={this.state.noTitleKey}
            onTabChange={key => {
                this.onTabChange(key, 'noTitleKey');
            }}
            >
                {contentListNoTitle[this.state.noTitleKey]}
            </Card>
            <Drawer
                title={this.state.title}
                placement="right"
                closable={false}
                onClose={this.onClose}
                visible={this.state.visible}
                >
                <div>
                    <label>Old Password</label>
                    <Input name="oldPassword" value={this.state.oldPassword} onChange={this.handleUpdate} />
                    <label>New Password</label>
                    <Input name="newPassword" value={this.state.newPassword} onChange={this.handleUpdate} />
                    <Button type="primary" onClick={this.changePassword}>
                        Submit
                    </Button>
                </div>
            </Drawer>
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

export default connect(mapStateToProps, { testSaml, updateCustomerStatus, addGlobalNotification, removeGlobalNotification, downgradeSubscription, enableSaml, disableSaml, uploadMetadata })(TabsCard);