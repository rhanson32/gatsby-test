import React from 'react';
import { connect } from 'react-redux';
import { Button, Table, Spin, Column, Card } from 'antd';
import Loading from './Loading';
import Header from './Header';
import { saveUser, getRules, getCurrentUser, toggleRule, modifyRules } from '../actions';
import LeftMenu from './LeftMenu';

class RulesPage extends React.Component {

    state = {
        showFilters: false,
        Category: "All",
        Status: "All"
    }

    componentDidMount = async () => {
        if(!this.props.User.email)
        {
            await this.props.getCurrentUser()
            this.props.getRules(this.props.User)
        }
        else {
            this.props.getRules(this.props.User);
        }
    }

    toggleRule = (event) => {
        this.props.toggleRule(event.target.id, this.props.User); 
        console.log(event.target.name);
        console.log(event.target.id);
    }

    disableAll = () => {
        console.log("Disabling all rules!");
        this.props.modifyRules("disable", this.props.User.CustomerId);
    }

    monitorAll = () => {
        console.log("Monitoring all rules!");
        this.props.modifyRules('monitor', this.props.User.CustomerId);
    }

    remediateAll = () => {
        console.log("Remediating all rules!");
        this.props.modifyRules('remediate', this.props.User.CustomerId);
    }

    toggleFilterMenu = () => {
        this.setState({
            showFilters: !this.state.showFilters
        });
    }

    handleUpdate = (event) => {
        this.setState({
          [event.target.name]: event.target.value,
        })
      }

    render() {
        const dataSource = this.props.Rules.map((rule, index) => {
            return {
                key: index.toString(),
                name: rule.Name,
                category: rule.Category,
                id: rule.RuleId,
                state: rule.Enabled ? "Monitor" : "Off",
                status:  <Button.Group>
                <Button name="off" id={rule.RuleId} onClick={this.toggleRule} style={{ backgroundColor: rule.Enabled ? "white" : "#27ae60", color: rule.Enabled ? "black" : "white" }} size="default" onClick={this.toggleRule}>
                    OFF
                </Button>
                <Button name="monitor" id={rule.RuleId} onClick={this.toggleRule} style={{ backgroundColor: rule.Enabled ? "#27ae60" : "white", color: rule.Enabled ? "white" : "black" }} size="default" onClick={this.toggleRule}>
                    Monitor
                </Button>
            </Button.Group>,
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
              title: 'Category',
              dataIndex: 'category',
              key: 'category',
              filters: [
                {
                  text: 'Security',
                  value: 'Security',
                },
                {
                  text: 'Waste',
                  value: 'Waste',
                },
                {
                    text: 'Configuration',
                    value: 'Configuration',
                }
              ],
                onFilter: (value, record) => record.category.indexOf(value) === 0,
                sorter: (a, b) => a.category.length - b.category.length,
                sortDirections: ['descend', 'ascend']
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              filters: [
                {
                  text: 'Off',
                  value: 'Off',
                },
                {
                  text: 'Monitor',
                  value: 'Monitor',
                }
              ],
              onFilter: (value, record) => record.state.indexOf(value) === 0
            },
          ];
        const ButtonGroup = Button.Group;
        return (
            <div>
                <Header />
                <div className="rules-page">
                    
                    <LeftMenu />
                    <div className="rules">
                        {
                            this.props.Rules.length === 0 && <Spin style={{ margin: "auto", width: "100%" }} size="large" />
                        }
                        {this.props.Rules.length !== 0 && (
                                <div className="rules-options">
                                    <div className="rules-header">
                                        <h2>Rules</h2>
                                    </div>
                                    <div className="rules-bulk-switch">
                                        <ButtonGroup>
                                            <Button size="large" onClick={this.disableAll}>Disable All</Button>
                                            <Button size="large" onClick={this.monitorAll}>Monitor All</Button>
                                            <Button size="large" onClick={this.remediateAll}>Remediate All</Button>
                                        </ButtonGroup>
                                    </div>
                                </div>
                            )
                        }
                        {this.props.Rules.length !== 0 && <Table pagination={{ position: "bottom" }} style={{ width: "90%", margin: "auto", maxWidth: "1200px", border: "1px solid #CCC", borderRadius: "3px" }} dataSource={dataSource} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />} 
                    </div> 
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        Rules: state.rules,
        User: state.user
    }
}

export default connect(mapStateToProps, { saveUser, getRules, getCurrentUser, toggleRule, modifyRules })(RulesPage);