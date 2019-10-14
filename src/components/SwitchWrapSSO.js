import React from 'react';
import { Switch } from 'antd';
import { connect } from 'react-redux';
import { enableSaml, disableSaml } from '../actions';

class SwitchWrapSSO extends React.Component {

    changeSwitch = (newState) => {
 
        if(newState)
        {
            this.props.enableSaml();
        }
        else
        {
            this.props.disableSaml();
        }
    }

    render() {
        return <Switch checked={this.props.checked} onChange={this.changeSwitch} />
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        settings: state.settings
    }
}

export default connect(mapStateToProps, { enableSaml, disableSaml })(SwitchWrapSSO);