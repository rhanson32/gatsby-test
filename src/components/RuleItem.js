import React from 'react';

class RuleItem extends React.Component {

    toggleRule = () => {
        console.log(this.props);

        fetch('https://youthful-jones-9692d2.netlify.com/.netlify/functions/hello').then(
            response => console.log(response)
        ).catch(err => console.log(err));
        // this.props.toggleRule(this.props.rule.Description);
    }
    render() {
        return (
            <div className="rule-item">
                <div className="rule-detail">
                    <div className="rule-description">
                        {this.props.rule.Description}
                    </div>
                    <div className="rule-category">
                        {this.props.rule.Category}
                    </div>
                    <div className="rule-provider">
                        {this.props.rule.Provider}
                    </div>
                </div>
                <div className="rule-status">
                    <button onClick={this.toggleRule} className={`${this.props.rule.Enabled === true ? 'enabled-button' : "disabled-button"}`}>
                        {this.props.rule.Enabled ? "ON": "OFF"}
                    </button>
                </div>
                
            </div>
        )
    }
}

export default RuleItem;