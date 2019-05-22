import React from 'react'
import Header from './Header'
import { connect } from 'react-redux'
import { getSettings } from '../actions'

class Settings extends React.Component {
    componentDidMount() {
        this.props.getSettings()
    }

    render() {
    return (
    <div className="settings-page">
        <Header />
        <div className="settings-header">
            Settings
        </div>
        <div className="settings-main">
            <div className="settings-switch">
                Operating Mode
                <button>
                    Monitor
                </button>
                <button>
                    Remediate
                </button>
            </div>
            <div className="settings-provider">
                <div className="settings-provider-header">
                    Cloud Providers
                </div>
                <div className="settings-provider-option">
                    <div className="settings-provider-option-header">
                        AWS
                    </div>
                    <div className="settings-provider-option-select">
                        <button className="add-button">
                            ON
                        </button>
                        <button className="remove-button">
                            OFF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
    }
}

export default connect(null, { getSettings })(Settings);