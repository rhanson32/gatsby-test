import React from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import { getCurrentUser, fetchUsers } from '../actions';
import { Table, Spin, Drawer, Button } from 'antd';
import LeftMenu from './LeftMenu';
import AddUserForm from './AddUserForm';

class Users extends React.Component {

    state = {
        visible: false
    }

    componentDidMount = async () => {
        await this.props.getCurrentUser()
        this.props.fetchUsers(this.props.user.CustomerId);
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
            return {
                key: index.toString(),
                name: user.Username,
                role: user.Group
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
              title: 'Role',
              dataIndex: 'role',
              key: 'role',
              filters: [
                {
                  text: 'Administrators',
                  value: 'Administrators',
                },
                {
                  text: 'Auditors',
                  value: 'Auditors',
                }
              ],
                onFilter: (value, record) => record.role.indexOf(value) === 0,
                sorter: (a, b) => a.role.length - b.role.length,
                sortDirections: ['descend', 'ascend']
            }
          ];
        
        return (
            <div className="users-page">
                <Header />
                <LeftMenu />
                <div className="users-main">
                    
                    <div className="support-screen-header">
                        <h1>User List</h1>
                    </div>
                    {
                        this.props.users.length === 0 && <Spin tip="Loading..." style={{ margin: "auto" }} size="large" />
                    }
                    {
                        this.props.users.length !== 0 && <Table pagination={this.props.users.length < 10 ? false : { position: "top" }} style={{ width: "90%", maxWidth: "800px", margin: "2rem auto", border: "1px solid #CCC", borderRadius: "3px" }} dataSource={dataSource} columns={columns} />
                    }
                    <Button type="primary" onClick={this.showDrawer}>Add User</Button>
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

export default connect(mapStateToProps, { getCurrentUser, fetchUsers })(Users);