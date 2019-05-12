import React from 'react'
import Header from './Header'

const Settings = () => (
    <div className="settings-page">
        <Header />
        <div className="settings-header">
            Settings
        </div>
        <div className="settings-main">
            <div className="settings-provider">
                <div className="settings-provider-header">
                    Cloud Providers
                </div>
                <div className="settings-provider-option">
                    <div className="settings-provider-option-header">
                        AWS
                    </div>
                    <div className="settings-provider-option-select">
                        <button>
                            ON
                        </button>
                        <button>
                            OFF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Settings;