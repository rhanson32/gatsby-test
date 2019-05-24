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

    render() {
        return (
            <div className="settings-menu">
                <div className="settings-menu-item">
                    <button name="General" onClick={this.toggleGeneralMenu}>General</button>
                </div>
                <div className="settings-menu-item">
                    <button onClick={this.toggleAWSMenu}>AWS</button>
                </div>
            </div>
        )
    }
}

export default connect(null, { toggleSettingsMenu })(SettingsMenu);