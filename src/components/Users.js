import React from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import AddUser from './AddUser';
import { getCurrentUser } from '../actions';
import LeftMenu from './LeftMenu';

class Users extends React.Component {

    componentDidMount = () => {
        this.props.getCurrentUser()
    }

    render() {
        return (
            <div className="users-page">
                <Header />
                <LeftMenu />
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

export default connect(null, { getCurrentUser })(Users);