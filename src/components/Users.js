import React from 'react';
import Header from './Header';
import AddUser from './AddUser';

class Users extends React.Component {

    render() {
        return (
            <div>
                <Header />
                <div className="users-main">
                    <div>
                        <h1>User List</h1>
                    </div>
                    <div className="users-list">
                        <div className="users-header">
                            <div>
                                Username
                            </div>
                            <div>
                                Role
                            </div>
                        </div>
                        <div className="users-item">
                            <div>
                                reed.hanson@gmail.com
                            </div>
                            <div>
                                Administrator
                            </div>  
                        </div>
                        
                    </div>
                    <div>
                        <h1>Add User</h1>
                    </div>
                    <AddUser />
                </div>
                
            </div>
        )
    }
}

export default Users;