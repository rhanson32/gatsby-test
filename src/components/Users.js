import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { getCurrentUser, fetchUsers, updateUser, deleteUser } from '../actions';
import { getExpiration } from '../utils/auth';
import { Table, Spin, Button, message } from 'antd';
import TopMenu from './TopMenu';
import Header from './Header';
import Footer from './Footer';
import AddUserForm from './AddUserForm';
import moment from 'moment';
import DashboardOverlay from './DashboardOverlay';

class Users extends React.Component {

    state = {
        visible: false,
        scanComplete: false
    }

    componentDidMount = async () => {
        const user = await this.props.getCurrentUser();
        if(moment(getExpiration()) < moment())
        {
            console.log("User session has expired");
            message.warning('Your session has expired. Redirecting to login page in 2 seconds.');
            if(user.type !== 'federated')
            {
                setTimeout(async () => {
                    await Auth.signOut();
                    navigate('/app/login');
                }, 2000); 
            }
            else
            {
                setTimeout(async () => {
                    navigate('/app/login');
                }, 2000); 
            }
        }
        else
        {
            await this.props.fetchUsers(this.props.user.CustomerId);
        }
        
        this.setState({ scanComplete: true });
        
    }

    makeAuditor = (e) => {
        console.log(e.target.name);
        this.props.updateUser({ sub: e.target.name, group: 'Auditors', company: this.props.user["custom:company"] ? this.props.user["custom:company"] : null });
    }

    makeAdministrator = (e) => {
        console.log(e.target.name);
        this.props.updateUser({ sub: e.target.name, group: 'Administrators', company: this.props.user["custom:company"] ? this.props.user["custom:company"] : null });
    }

    removeUser = (e) => {
        console.log(e.target.name);
        this.props.deleteUser({ sub: e.target.name, company: this.props.user["custom:company"] ? this.props.user["custom:company"] : null });
    }

    showDrawer = () => {
        this.setState({
          visible: true,
        });
      };
    
    onClose = () => {
    this.setState({
        visible: false,
    });
    };

    render() {
        const dataSource = this.props.users.map((user, index) => {
            if(this.props.user.Group.includes('Administrators'))
            {
                return {
                    key: index.toString(),
                    name: user.Username,
                    role: user.Group === 'Administrators' ? 'Administrator': 'Auditor',
                    type: user.Type,
                    action: user.Group === 'Administrators' ? <Button name={user.Sub} onClick={this.makeAuditor} type="link">Make Auditor</Button> : <Button name={user.Sub} onClick={this.makeAdministrator} type="link">Make Administrator</Button>,
                    action2: user.Type === 'Purify' ? <Button name={user.Sub} onClick={this.removeUser} type="link">Remove</Button> : ''
                } 
            }
            else
            {
                return {
                    key: index.toString(),
                    name: user.Username,
                    role: user.Group === 'Administrators' ? 'Administrator': 'Auditor',
                    type: user.Type,
                    action: ''
                } 
            }
               
        });

        const columns = [
            {
              title: 'User Name',
              dataIndex: 'name',
              key: 'name',
                sorter: (a, b) => a.name.length - b.name.length,
                sortDirections: ['descend', 'ascend']
            },
            {
                title: 'User Type',
                dataIndex: 'type',
                key: 'type',
                  sorter: (a, b) => a.type.length - b.type.length,
                  sortDirections: ['descend', 'ascend']
            },
            {
              title: 'Role',
              dataIndex: 'role',
              key: 'role',
              filters: [
                {
                  text: 'Administrator',
                  value: 'Administrator',
                },
                {
                  text: 'Auditor',
                  value: 'Auditor',
                }
              ],
                onFilter: (value, record) => record.role.indexOf(value) === 0,
                sorter: (a, b) => a.role.length - b.role.length,
                sortDirections: ['descend', 'ascend']
            },
            {
                title: '',
                dataIndex: 'action',
                key: 'action'
            },
            {
                title: '',
                dataIndex: 'action2',
                key: 'action2'
            }
          ];
        
        return (
            <div className="users-page">
                <Header />
                <TopMenu />
                <div className="users-main">
                    {this.state.scanComplete && (
                        <div className="users-max">
                            <div className="users-header">
                                <div className="rules-header">
                                    <h1>User List</h1>
                                </div>
                                <div className="rules-options">
                                    {!this.state.visible && <Button type="primary" onClick={this.showDrawer}>Add User</Button>}
                                    {this.state.visible && <Button type="primary" onClick={this.onClose}>Close User Form</Button>}
                                </div>
                            </div>
                            {this.state.visible && <AddUserForm />}
                            {
                                this.props.users.length === 0 && <Spin tip="Loading..." style={{ margin: "auto" }} size="large" />
                            }
                            {
                                this.props.users.length !== 0 && (
                                    <div className="web-users">
                                        <Table pagination={this.props.users.length < 10 ? false : { position: "top" }} style={{ width: "100%", maxWidth: "900px", margin: "2rem 0" }} dataSource={dataSource} columns={columns} />
                                    </div>
                                )
                            }
                        </div>
                    )}
                    {
                        !this.state.scanComplete && <DashboardOverlay />
                    }
                    
                </div>   
                <Footer />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        users: state.users,
        user: state.user
    }
}

export default connect(mapStateToProps, { getCurrentUser, fetchUsers, updateUser, deleteUser })(Users);