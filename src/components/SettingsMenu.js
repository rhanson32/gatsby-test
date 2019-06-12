import React from 'react'
import { connect } from 'react-redux';
import { toggleSettingsMenu } from '../actions';

class SettingsMenu extends React.Component {

    toggleGeneralMenu = () => {
        this.props.toggleSettingsMenu('General');
    }
    toggleAWSMenu = () => {
        this.props.toggleSettingsMenu('AWS');
    }

    toggleUserMenu = () => {
        this.props.toggleSettingsMenu('User');
    }

    render() {
        return (
            <div className="settings-menu">
                <div className="settings-menu-item">
                    <button className={this.props.menu === 'General' ? "orange-button" : 'clear-button'} name="General" onClick={this.toggleGeneralMenu}>General</button>
                </div>
                <div className="settings-menu-item">
                    <button className={this.props.menu === 'AWS' ? "orange-button" : 'clear-button'} onClick={this.toggleAWSMenu}>AWS</button>
                </div>
                <div className="settings-menu-item">
                    <button className={this.props.menu === 'User' ? "orange-button" : 'clear-button'} onClick={this.toggleUserMenu}>User</button>
                </div>
            </div>
        )
    }
}

export default connect(null, { toggleSettingsMenu })(SettingsMenu);