import React from 'react';
import Header from './Header';

class Users extends React.Component {

    render() {
        return (
            <div>
                <Header />
                <div className="users-main">
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
                </div>
                
            </div>
        )
    }
}

export default Users;