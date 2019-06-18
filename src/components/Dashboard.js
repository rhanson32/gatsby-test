import React from 'react';
import { connect } from 'react-redux';
import { Button, Card, Progress } from 'antd';

import LeftMenu from './LeftMenu';
import Header from './Header';
import { IoIosArrowDown } from 'react-icons/io';
import { getCurrentUser, getRules } from '../actions';

import 'antd/dist/antd.css';

class Dashboard extends React.Component {

    state = {
        showSecurity: false,
        showWaste: false,
        showLogging: false,
        showConfiguration: false
    }

    componentDidMount = async () => {
        if(!this.props.User.email)
        {
            await this.props.getCurrentUser();
            this.props.getRules(this.props.User);
        }
        else
        {
            this.props.getRules(this.props.User);
        }
    }

    toggleSecurity = () => {
        this.setState({
            showSecurity: !this.state.showSecurity
        })
    }

    toggleWaste = () => {
        this.setState({
            showWaste: !this.state.showWaste
        })
    }

    toggleLogging = () => {
        this.setState({
            showLogging: !this.state.showLogging
        })
    }

    toggleConfiguration = () => {
        this.setState({
            showConfiguration: !this.state.showConfiguration
        })
    }

    render() {

        return (
            <div className="dashboard-page">
                <Header />
                <LeftMenu />
                <div className="dashboard">
                    <Card style={{ margin: "1rem" }} title="Security" headStyle={{ backgroundColor: "#27ae60", color: "white", fontSize: "1.6rem" }}>
                        <Progress type="circle" percent={50} width={300} />
                    </Card>
                    <Card style={{ margin: "1rem" }} title="Waste" headStyle={{ backgroundColor: "#27ae60", color: "white", fontSize: "1.6rem" }}>
                        <Progress type="circle" percent={70} width={300} />
                    </Card>
                    <Card style={{ margin: "1rem" }} title="Configuration" headStyle={{ backgroundColor: "#27ae60", color: "white", fontSize: "1.6rem" }}>
                        <Progress type="circle" percent={92} width={300} />
                    </Card>
                    <div className="dashboard-categories">
                        <div className="dashboard-category">
                            <div className="dashboard-category-header">
                                    <div>
                                    Security
                                </div>
                                <div>
                                    {this.props.rules.filter(rule => rule.Category === "Security").length - this.props.rules.filter(rule => rule.Violations.length !== 0 && rule.Category === "Security").length} of {this.props.rules.filter(rule => rule.Category === "Security").length} rules compliant
                                </div>
                                <div>
                                    <button className="rule-arrow">
                                        <IoIosArrowDown onClick={this.toggleSecurity} />
                                    </button>
                                </div>
                            </div>
                            {
                                this.state.showSecurity && this.props.rules.filter(rule => rule.Category === "Security").map((rule, index) => {
                                    return (
                                        <div key={index} className="dashboard-category-item">
                                            <div>
                                                {rule.Name}
                                            </div>
                                            <div>
                                                {rule.Violations.length === 0 ? "Compliant" : "Violations: " + rule.Violations.length  }
                                            </div>
                                            <div>
                                                {rule.Violations.length !== 0 ? <Button>View Violations</Button> : ""}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="dashboard-category">
                            <div className="dashboard-category-header">
                                <div>
                                    Waste
                                </div>
                                <div>
                                {this.props.rules.filter(rule => rule.Category === "Waste").length - this.props.rules.filter(rule => rule.Violations.length !== 0 && rule.Category === "Waste").length} of {this.props.rules.filter(rule => rule.Category === "Waste").length} rules compliant
                                </div>
                                <div>
                                    <button className="rule-arrow">
                                        <IoIosArrowDown onClick={this.toggleWaste} />
                                    </button>
                                </div>
                            </div>
                            {
                                this.state.showWaste && this.props.rules.filter(rule => rule.Category === "Waste").map((rule, index) => {
                                    return (
                                        <div key={index} className="dashboard-category-item">
                                            <div>
                                                {rule.Name}
                                            </div>
                                            <div>
                                                {rule.Violations.length === 0 ? "Compliant" : "Violations: " + rule.Violations.length  }
                                            </div>
                                            <div>
                                                {rule.Violations.length !== 0 ? "View Violations": ""}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="dashboard-category">
                            <div className="dashboard-category-header">
                                <div>
                                    Configuration
                                </div>
                                <div>
                                {this.props.rules.filter(rule => rule.Category === "Configuration").length - this.props.rules.filter(rule => rule.Violations.length !== 0 && rule.Category === "Configuration").length} of {this.props.rules.filter(rule => rule.Category === "Configuration").length} rules compliant
                                </div>
                                <div>
                                    <button className="rule-arrow">
                                        <IoIosArrowDown onClick={this.toggleConfiguration} />
                                    </button>
                                </div>
                            </div>
                            {
                                this.state.showConfiguration && this.props.rules.filter(rule => rule.Category === "Configuration").map((rule, index) => {
                                    return (
                                        <div key={index} className="dashboard-category-item">
                                            <div>
                                                {rule.Name}
                                            </div>
                                            <div>
                                                {rule.Violations.length === 0 ? "Compliant" : "Violations: " + rule.Violations.length  }
                                            </div>
                                            <div>
                                                {rule.Violations.length !== 0 ? "View Violations": ""}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    } 
}

const mapStateToProps = state => {
    return {
        User: state.user,
        rules: state.rules
    }
}

export default connect(mapStateToProps, { getCurrentUser, getRules })(Dashboard);