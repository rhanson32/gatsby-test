import React from 'react';
import { Card, Table, Button, Modal, Input, Icon, Drawer, Tag, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { Auth } from 'aws-amplify';
import AWSAccount from './AWSAccount';
import RegionsForm from './RegionsForm';
import ServicesForm from './ServicesForm';
import { updateCustomerStatus, addGlobalNotification, removeGlobalNotification, enableSaml, disableSaml, uploadMetadata } from '../actions';
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
    recipient: ``
  };

    showKey = () => {
        this.setState({
            showKey: !this.state.showKey
        })
    }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };

  cancelAccount = async () => {
      console.log("Cancelling account...");
      await this.props.updateCustomerStatus('Cancelled');
      console.log("Account cancelled.");
  }

  handleUpdate = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  changePassword = async () => {
      const user = await Auth.currentAuthenticatedUser();
        const response = await Auth.changePassword(user, this.state.oldPassword, this.state.newPassword).catch(err => console.log(err));

        console.log(response);
        this.setState({ 
            oldPassword: ``,
            newPassword: ``
        });
  }

  showConfirm = () => {
    const { confirm } = Modal;
    console.log(this);
    confirm({
        title: 'Are you sure you want to cancel your account?',
        onOk() {
          console.log(this);
        },
        onCancel() {}
      });
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

  onChangeHandler = (e) => {
    console.log(e.target.files);
    this.setState({
        metadataFile: e.target.files[0]
    })
  }

  submitMetadata = () => {
      const data = new FormData();
      data.append('file', this.state.metadataFile);
      this.props.uploadMetadata(data);
  }

  submitMFA = async () => {

    const user = await Auth.currentAuthenticatedUser();
    const response = await Auth.verifyTotpToken(user, this.state.challengeAnswer);
    console.log(response);
    Auth.setPreferredMFA(user, 'TOTP').then(data => console.log(data));
    Auth.currentAuthenticatedUser().then(data => console.log(data));
    this.setState({
        showMFASetup: false
    });
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
      const user = await Auth.currentAuthenticatedUser().catch(err => console.log(err));
      console.log(user);
      const response = await Auth.setupTOTP(user).catch(err => console.log(err));
        this.setState({
            mfaCode: response
        });

    const issuer = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_wMiZuxWyI';
      console.log(response);
      const str = "otpauth://totp/AWSCognito:"+ this.props.user.sub + "?secret=" + this.state.mfaCode + "&issuer=" + issuer;
    this.setState({
        qrCode: str,
        showMFASetup: true
    });

  }

    submitNotification = () => {
        if(!this.props.settings.Notifications.includes(this.state.recipient) && this.state.recipient.includes('@'))
        {
            this.props.addGlobalNotification(this.state.recipient);
            this.setState({
                recipient: ``
            });
        }   
        else
        {
            console.log("Invalid entry");
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
                    {this.props.user.Plan === "Free" && this.props.user.Group.includes('Administrators') && <Button type="primary" size="large" onClick={this.showPlans}>Upgrade Subscription</Button>}
                    {this.props.user.Plan === "Free" && !this.props.user.Group.includes('Administrators') && <Button type="primary" disabled size="large" onClick={this.showPlans}>Upgrade Subscription</Button>}
                    <Button type="danger" size="large" onClick={this.showConfirm}>
                        Cancel Subscription
                    </Button>      
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
                            <Button type="primary" size="large" onClick={this.showPassword}>Change Password</Button>
                            {!this.props.user.MFA && <Button type="primary" size="large" onClick={this.setupMFA}>Set up MFA</Button>}
                            {this.props.user.MFA && <Button type="primary" size="large" onClick={this.disableMFA}>Disable MFA</Button>}
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
        {
            this.props.accounts.length === 0 && (
                <div className="settings-card-title">
                    Enter the details of your AWS Master account, and we will automatically discover the rest of your AWS accounts.
                </div>
            )
        }
        {this.props.accounts.length === 0 && <AWSAccount />} 
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
        <div className="settings-row">
            <RegionsForm />
        </div>  
        <div className="settings-row">
            <ServicesForm />
        </div>  
      </div>,
      SSO: <div>
      {
          !this.props.settings.saml && (
              <div className="settings-row">
                <div className="settings-left-side">
                    SSO Status:
                </div>
                <div className="settings-subscription">
                    <Button onClick={this.enableSaml}>
                        Disabled
                    </Button>
                </div>
              </div>
          )
      }
      {
          this.props.settings.saml && (
              <div className="settings-row">
                <div className="settings-left-side">
                    SSO Status:
                </div>
                <div className="settings-subscription">
                    <Button type="primary" onClick={this.disableSaml}>
                        Enabled
                    </Button>
                </div>
              </div>
          )
      }
      {
          this.props.settings.saml && (
              <div className="settings-row">
                <div className="settings-left-side">
                    Upload Metadata file:
                </div>
                <div className="settings-subscription">
                    <input type="file" name="file" onChange={this.onChangeHandler} />
                    <Button type="primary" onClick={this.submitMetadata}>
                        Upload
                    </Button>
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

export default connect(mapStateToProps, { updateCustomerStatus, addGlobalNotification, removeGlobalNotification, enableSaml, disableSaml, uploadMetadata })(TabsCard);