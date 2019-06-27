import React from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import AddUser from './AddUser';
import { getCurrentUser, fetchUsers } from '../actions';
import { Table, Spin } from 'antd';
import LeftMenu from './LeftMenu';

class Users extends React.Component {

    componentDidMount = async () => {
        await this.props.getCurrentUser()
        this.props.fetchUsers(this.props.user.CustomerId);
    }

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
                    
                    <div>
                        <h1>User List</h1>
                    </div>
                    {
                        this.props.users.length === 0 && <Spin style={{ margin: "auto" }} size="large" />
                    }
                    {
                        this.props.users.length !== 0 && <Table pagination={{ position: "top" }} style={{ width: "90%", margin: "2rem auto" }} dataSource={dataSource} columns={columns} />
                    }
                    {
                        this.props.users.length !== 0 && (
                            <div>
                                <h1>Add User</h1>
                            </div>
                        )
                    }
                    {
                        this.props.users.length !== 0 && <AddUser />
                    }
                    
                    
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