import React from 'react';
import { Card, Table, Button, Modal, Input } from 'antd';
import { connect } from 'react-redux';
import { Auth } from 'aws-amplify';
import AWSAccount from './AWSAccount';
import AddAccount from './AddAccount';
import RegionsForm from './RegionsForm';
import ServicesForm from './ServicesForm';
import { updateCustomerStatus } from '../actions';
import { navigate } from '@reach/router';

class TabsCard extends React.Component {
  state = {
    noTitleKey: 'General',
    showKey: false
  };

    showKey = () => {
        this.setState({
            showKey: !this.state.showKey
        })
    }

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  cancelAccount = () => {
      console.log("Cancelling account...");
      this.props.updateCustomerStatus('Cancelled');
  }

  handleUpdate = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })

    console.log(this.state);
  }

  changePassword = async () => {
      const user = await Auth.currentAuthenticatedUser();
        const response = await Auth.changePassword(user, this.state.oldPassword, this.state.newPassword).catch(err => console.log(err));

        console.log(response);
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
          key: 'User',
          tab: 'User',
        },
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
      
      const contentListNoTitle = {
        General: <div>
            <div className="settings-row">
              <p style={{ margin: "0 2rem" }}>Unhappy with your current plan?</p>  
            {this.props.user.Plan === "Free" && <Button type="primary" size="large" onClick={this.showPlans}>Update My Plan</Button>}
        </div>
        <div className="settings-row">
            <div className="settings-left-side">
                API Key
            </div>
            <div className="settings-switch">
                {
                    !this.state.showKey && (
                        <Button type="link" onClick={this.showKey}>
                            Show
                        </Button>
                    )
                }
                {
                    this.state.showKey && (
                        <Button type="link" onClick={this.showKey}>
                           &nbsp; Hide
                        </Button>
                    )
                }
                {this.state.showKey && this.props.user.Key}
            </div>
        </div>
        <div className="settings-row">
            <div className="cancel-account">
                <Button type="danger" onClick={this.showConfirm}>
                    Cancel My Account
                </Button>
                    
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
                        {
                            !this.props.accounts.find(account => account.Type === 'Master') && (
                                <AddAccount />
                            )
                        }
                        <Table style={{ border: "1px solid #CCC", borderRadius: "3px" }} pagination={false} dataSource={dataSource.filter(source => source.type === 'Master')} columns={columns} />
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
        User:  <div>
        <div className="settings-row">
            <div className="settings-left-side">
                Change Password
            </div>
            <div className="settings-switch">
                <label>Old Password</label>
                <Input name="oldPassword" value={this.state.oldPassword} onChange={this.handleUpdate} />
                <label>New Password</label>
                <Input name="newPassword" value={this.state.newPassword} onChange={this.handleUpdate} />
                <Button type="primary" onClick={this.changePassword}>
                    Submit
                </Button>
            </div>
            
        </div>
    </div>
      };

    return (
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

export default connect(mapStateToProps, { updateCustomerStatus })(TabsCard);