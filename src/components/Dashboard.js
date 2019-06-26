import React from 'react';
import { connect } from 'react-redux';
import { Button, Card, Progress, Table, Statistic } from 'antd';

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

        const dataSourceConfiguration = this.props.rules.filter(rule => rule.Category === 'Configuration').map((rule, index) => {
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

        const dataSourceWaste = this.props.rules.filter(rule => rule.Category === 'Waste').map((rule, index) => {
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
                    <Card style={{ margin: "1rem auto", width: "90%" }} title={<div className="dashboard-card-header"><div>Category Metrics</div> <div className="dashboard-card-key"><div className="dashboard-key-item">Red</div><div className="dashboard-key-item">Blue</div><div className="dashboard-key-item">Green</div></div></div>} headStyle={{ fontSize: "1.6rem" }}>
                        <Progress style={{ margin: "1rem" }} type="dashboard" percent={Math.round(this.props.rules.filter(rule => rule.Category === 'Security' && rule.Violations.length === 0).length * 100 / this.props.rules.filter(rule => rule.Category === "Security").length)} width={300} strokeColor={"green"} />
                        <Progress style={{ margin: "1rem" }} type="dashboard" percent={Math.round(this.props.rules.filter(rule => rule.Category === 'Waste' && rule.Violations.length === 0).length * 100 / this.props.rules.filter(rule => rule.Category === "Waste").length)} width={300} />
                        <Progress style={{ margin: "1rem" }} type="dashboard" percent={Math.round(this.props.rules.filter(rule => rule.Category === 'Configuration' && rule.Violations.length === 0).length * 100 / this.props.rules.filter(rule => rule.Category === "Configuration").length)} width={300} strokeColor={"red"} />
                    </Card>

                    <div className="dashboard-categories">
                        <div className="dashboard-cards">
                            <Card headStyle={{ backgroundColor: "green", color: 'white' }} title="Security" style={{ width: "48%", margin: "1%" }}>
                                <div className="dashboard-card-statistics">
                                    <Statistic title="Violations" value={23} style={{ margin: "0.5rem 1rem" }} />
                                    <Statistic title="Assets Evaluated" value={25} style={{ margin: "0.5rem 1rem" }} />
                                </div>
                                <Table size="middle" pagination={{ position: "top" }} style={{ width: "100%", margin: "auto" }} dataSource={dataSourceSecurity} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />
                            </Card>
                            <Card headStyle={{ backgroundColor: "blue", color: 'white' }} title="Configuration" style={{ width: "48%", margin: "1%" }}>
                            <div className="dashboard-card-statistics">
                                <Statistic title="Violations" value={25} style={{ margin: "0.5rem 1rem" }} />
                                <Statistic title="Assets Evaluated" value={25} style={{ margin: "0.5rem 1rem" }} />
                            </div>
                                <Table size="middle" pagination={{ position: "top" }} style={{ width: "100%", margin: "auto" }} dataSource={dataSourceConfiguration} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />
                            </Card>
                            <Card headStyle={{ backgroundColor: "purple", color: 'white' }} title="Waste" style={{ width: "48%", margin: "1%" }}>
                            <div className="dashboard-card-statistics">
                                <Statistic title="Violations" value={25} style={{ margin: "0.5rem 1rem" }} />
                                <Statistic title="Assets Evaluated" value={25} style={{ margin: "0.5rem 1rem" }} />
                            </div>
                                <Table size="middle" pagination={{ position: "top" }} style={{ width: "100%", margin: "auto" }} dataSource={dataSourceWaste} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />
                            </Card>
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