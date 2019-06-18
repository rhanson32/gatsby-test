import React from 'react';
import { connect } from 'react-redux';
import { Button, Card, Progress, Table } from 'antd';

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

        const dataSourceSecurity = this.props.rules.filter(rule => rule.Category === 'Security').map((rule, index) => {
            return {
                key: index.toString(),
                name: rule.Name,
                category: rule.Category,
                id: rule.RuleId,
                status:  rule.Violations.length === 0 ? "Compliant": "Non-Compliant",
                violations: rule.Violations.length,
                description: rule.Description
            }    
        });
          
          const columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
                sorter: (a, b) => a.name.length - b.name.length,
                sortDirections: ['descend', 'ascend']
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status'
            },
            {
                title: 'Violations',
                dataIndex: 'violations',
                key: 'violations'
            },
            {
              title: 'Action',
              dataIndex: 'action',
              key: 'action'
            },
          ];
        return (
            <div className="dashboard-page">
                <Header />
                <LeftMenu />
                <div className="dashboard">
                    <Card style={{ margin: "1rem", width: "90%" }} title={<div className="dashboard-card-header"><div>Category Metrics</div> <div className="dashboard-card-key"><div className="dashboard-key-item">Red</div><div>Blue</div><div>Green</div></div></div>} headStyle={{ fontSize: "1.6rem" }}>
                   
                        <Progress style={{ margin: "1rem" }} type="dashboard" percent={50} width={300} strokeColor={"green"} />
                        <Progress style={{ margin: "1rem" }} type="dashboard" percent={50} width={300} />
                        <Progress style={{ margin: "1rem" }} type="dashboard" percent={50} width={300} strokeColor={"red"} />
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
                        <Table size="middle" pagination={{ position: "top" }} style={{ width: "90%", margin: "auto" }} dataSource={dataSourceSecurity} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />
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