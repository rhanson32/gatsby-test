import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import moment from 'moment';
import { Link } from 'gatsby';
import { FaAws, FaMicrosoft } from 'react-icons/fa';
import { Spin, Button, Table, Alert, message, Drawer, Input } from 'antd';
import Header from './Header'
import { postAccount, getAccounts, toggleAddAccount, getCurrentUser } from '../actions';
import LeftMenu from './LeftMenu';
import SwitchWrapAccount from './SwitchWrapAccount';
import { getExpiration } from '../utils/auth';

class Accounts extends React.Component {

  state = {
    scanComplete: false,
    showDrawer: false,
    accountId: ``
  }

    componentDidMount = async () => {
      if(moment(getExpiration()) < moment())
        {
            console.log("User session has expired");
            message.warning('Your session has expired. Redirecting to login page in 2 seconds.');
            setTimeout(async () => {
                await Auth.signOut();
                navigate('/app/login');
            }, 2000); 
        }
        if(!this.props.user || !this.props.user.CustomerId)
        {
            await this.props.getCurrentUser()
        }
        if(this.props.user && this.props.user.CustomerId)
        {
            await this.props.getAccounts(this.props.user.CustomerId);
            this.setState({ scanComplete: true });
        }      
    }

    addAccount = () => {
        this.props.toggleAddAccount();
    }

    handleChange = (e) => {
      console.log("Switched!");
      console.log(e);
      
    }

    submitAccount = () => {
        this.setState({ AddAccount: false});
        postAccount();
    }

    onClose = () => {
      this.setState({
        showDrawer: false
      })
    }

    showDrawer = (event) => {
      console.log(event.target.id);
      this.setState({
        accountId: event.target.id,
        showDrawer: true
      });
    }

    render() {
        const dataSource = this.props.Accounts && this.props.Accounts.map((account, index) => {
            return {
                key: index.toString(),
                accountId: account.AccountId,
                provider: account.Provider === 'AWS' ? <FaAws size="2em" /> : <FaMicrosoft />,
                role: account.RoleName,
                status:  account.Status === "Valid" ?
                <Button type="link" name="off" id={account.AccountId} size="large">
                    Valid
                </Button> :
                <Button name="monitor" id={account.AccountId} style={{ backgroundColor: account.Enabled ? "#27ae60" : "white", color: account.Enabled ? "white" : "black" }} size="large">
                    Invalid
                </Button>,
                state: <SwitchWrapAccount checked={account.Enabled} account={account} />,
                action: <Button type="link" id={account.AccountId} onClick={this.showDrawer}>Edit</Button>
            }    
        });

        const MissingMaster = () => (
          <p style={{ margin: "2rem auto", width: "80%" }}>Purify scans for AWS accounts using the AWS Master account. Please enter your master account details on the AWS tag within  <Link to="/app/settings">Settings</Link>.</p>
        );
          
          const columns = [
            {
              title: 'Account ID',
              dataIndex: 'accountId',
              key: 'accountId',
                sorter: (a, b) => a.accountId.length - b.accountId.length,
                sortDirections: ['descend', 'ascend']
            },
            {
              title: 'Provider',
              dataIndex: 'provider',
              key: 'provider',
              filters: [
                {
                  text: 'AWS',
                  value: 'AWS',
                },
                {
                  text: 'Azure',
                  value: 'Azure',
                }
              ],
                onFilter: (value, record) => record.provider.indexOf(value) === 0,
                sorter: (a, b) => a.provider.length - b.provider.length,
                sortDirections: ['descend', 'ascend']
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              filters: [
                {
                  text: 'Valid',
                  value: 'Valid',
                },
                {
                  text: 'Invalid',
                  value: 'Invalid',
                }
              ],
              onFilter: (value, record) => record.state.indexOf(value) === 0
            },
            {
              title: 'Role',
              dataIndex: 'role',
              key: 'role'
            },
            {
              title: 'State',
              dataIndex: 'state',
              key: 'state'
            },
            {
              title: ' ',
              dataIndex: 'action',
              key: 'action'
            }
          ];
        return (
            <div className="accounts-page">
                <Header />
                <LeftMenu />
                <div className="accounts">
                  <div className="support-screen-header">
                      <h1>Accounts</h1>
                  </div>
                  {
                    this.state.scanComplete && this.props.Accounts.length === 0 && (
                      <Alert
                      style={{ width: "80%", margin: "0 auto" }}
                      message="AWS Master Account Missing"
                      description={<MissingMaster />}
                      type="warning"
                      showIcon
                      closable
                      closeText="Close"
                    />
                    )
                  }
                    {
                        !this.state.scanComplete && <Spin tip="Loading..." style={{ margin: "auto", fontSize: "2rem" }} size="large" />
                    }
                    {
                        this.state.scanComplete && <Table pagination={this.props.Accounts.length < 10 ? false : { position: "top" }} style={{ width: "80%", maxWidth: "900px", margin: "2rem auto", border: "1px solid #CCC", borderRadius: "3px" }} dataSource={dataSource} columns={columns} />
                    }
                   {
                     this.state.showDrawer && (
                       <Drawer
                        title="Edit Account"
                        placement="right"
                        closable={false}
                        onClose={this.onClose}
                        visible={this.state.showDrawer}
                       >
                         <label>IAM Role</label>
                         <Input
                          style={{ margin: "1rem 0" }}
                          placeholder="Example text"
                          />
                          <div className="drawer-submit">
                            <Button type="primary">Update</Button>
                          </div>
                         
                       </Drawer>
                     )
                   }
                </div>
                
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        Accounts: state.accounts,
        Flags: state.flags,
        user: state.user
    }
}

export default connect(mapStateToProps, { getAccounts, toggleAddAccount, getCurrentUser })(Accounts);