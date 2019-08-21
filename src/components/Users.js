import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { getCurrentUser, fetchUsers, updateUser } from '../actions';
import { getExpiration } from '../utils/auth';
import { Table, Spin, Drawer, Button, message } from 'antd';
import TopMenu from './TopMenu';
import Header from './Header';
import AddUserForm from './AddUserForm';
import moment from 'moment';

class Users extends React.Component {

    state = {
        visible: false
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
        await this.props.getCurrentUser();
        this.props.fetchUsers(this.props.user.CustomerId);
    }

    makeAuditor = (e) => {
        console.log(e.target.name);
        this.props.updateUser({ sub: e.target.name, group: 'Auditors' })
    }

    makeAdministrator = (e) => {
        console.log(e.target.name);
        this.props.updateUser({ sub: e.target.name, group: 'Administrators' })
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
                    action: user.Group === 'Administrators' ? <Button name={user.Sub} onClick={this.makeAuditor} type="link">Make Auditor</Button> : <Button onClick={this.makeAdministrator} type="link">Make Administrator</Button>
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
            }
          ];
        
        return (
            <div className="users-page">
                <Header />
                <TopMenu />
                <div className="users-main">
                    <div className="users-max">
                    <div className="users-header">
                        <div className="rules-header">
                            <h1>User List</h1>
                        </div>
                        <div className="rules-options">
                            <Button type="primary" onClick={this.showDrawer}>Add User</Button>
                        </div>
                    </div>
                    {
                        this.props.users.length === 0 && <Spin tip="Loading..." style={{ margin: "auto" }} size="large" />
                    }
                    {
                        this.props.users.length !== 0 && <Table pagination={this.props.users.length < 10 ? false : { position: "top" }} style={{ width: "100%", maxWidth: "900px", margin: "2rem 0", border: "1px solid #CCC", borderRadius: "3px" }} dataSource={dataSource} columns={columns} />
                    }
                    </div>
                    <Drawer
                        title="Add User"
                        placement="right"
                        closable={false}
                        onClose={this.onClose}
                        visible={this.state.visible}
                        >
                        <AddUserForm />
                    </Drawer>
                    
                </div>   
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

export default connect(mapStateToProps, { getCurrentUser, fetchUsers, updateUser })(Users);