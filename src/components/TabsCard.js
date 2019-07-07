import React from 'react';
import { Card, Table, Button, Modal, Input } from 'antd';
import { connect } from 'react-redux';
import AWSAccount from './AWSAccount';
import AddAccount from './AddAccount';
import RegionsForm from './RegionsForm';
import { updateCustomerStatus } from '../actions';

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

  showConfirm = () => {
    const { confirm } = Modal;
    confirm({
        title: 'Are you sure you want to cancel your account?',
        content: 'When clicked the OK button, this dialog will be closed after 1 second',
        onOk () {
          console.log(this);
        },
        onCancel() {},
      });
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
            <div className="settings-left-side">
                Default Operating Mode
            </div>
            <Button.Group>
                <Button>
                    Monitor
                </Button>
                <Button>
                    Remediate
                </Button>
            </Button.Group>
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
                <Button type="danger" onClick={this.cancelAccount}>
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
        {
             this.props.accounts.length === 0 && (
                <div className="settings-card-title">
                    <div className="account-list">
                        <div className="account-header">
                            <div className="account-item-field-large">
                                Account ID
                            </div>
                            <div className="account-item-field-large">
                                Role Name
                            </div>
                            <div className="account-item-field">
                                &nbsp;  
                            </div>
                        </div>
                        <AWSAccount />
                    </div>
                </div>
            )
        } 
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
      </div>,
        User:  <div>
        <div className="settings-row">
            <div className="settings-left-side">
                Change Password
            </div>
            <div className="settings-switch">
                <label>Old Password</label>
                <Input />
                <label>New Password</label>
                <Input />
                <Button>
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