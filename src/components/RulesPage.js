import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { Link } from 'gatsby';
import moment from 'moment';
import { getExpiration } from '../utils/auth';
import { Button, Table, Spin, message, Switch } from 'antd';
import Header from './Header';
import { saveUser, getRules, getCurrentUser, enableRule, disableRule, modifyRules } from '../actions';
import LeftMenu from './LeftMenu';

class RulesPage extends React.Component {

    state = {
        showFilters: false,
        Category: "All",
        Status: "All"
    }

    componentDidMount = async () => {
        if(moment(getExpiration()) < moment())
        {
            console.log("User session has expired");
            message.warning('Your session has expired. Redirecting to login page in 2 seconds.');
            setTimeout(async () => {
                await Auth.signOut();
                navigate('/app/login');
            }, 2000); 
        }
        if(!this.props.User.email)
        {
            await this.props.getCurrentUser();
            this.props.getRules(this.props.User);
        }
        else {
            this.props.getRules(this.props.User);
        }
    }

    error = () => {
        const RulesMessage = () => (
            <div>
                Free plan users may only enable 10 rules at one time. Please <Link to="/app/payment">upgrade</Link> to the Standard plan to remove the cap on rules.
            </div>
        )
        message.error(<RulesMessage />, 5);
    };

    enableRule = (event) => {
        const enabledCount = this.props.Rules.filter(rule => rule.Enabled).length;
        console.log(enabledCount);
        
        if(enabledCount >= 10 && this.props.User.Plan === "Free")
        {
            console.log("Cannot add more rules. Please upgrade to the Standard Plan to enable more rules.");
            this.error();
        }
        else
        {
            this.props.enableRule(event.target.id, this.props.User); 
        }
    }

    disableRule = (event) => {
        this.props.disableRule(event.target.id, this.props.User); 
    }

    disableAll = () => {
        this.props.modifyRules("disable", this.props.User.CustomerId);
    }

    monitorAll = () => {
        this.props.modifyRules('monitor', this.props.User.CustomerId);
    }

    remediateAll = () => {
        this.props.modifyRules('remediate', this.props.User.CustomerId);
    }

    toggleFilterMenu = () => {
        this.setState({
            showFilters: !this.state.showFilters
        });
    }

    changeSwitch = (newState) => {
        console.log(newState);
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
                state2: <Switch id={rule.ruleId} checked={rule.Enabled} onChange={this.changeSwitch} />,
                state: rule.Enabled ? "Monitor" : "Off",
                status:  <Button.Group>
                <Button name="off" id={rule.RuleId} onClick={this.disableRule} type={!rule.Enabled ? "primary": "default"} size="default">
                    OFF
                </Button>
                <Button name="monitor" id={rule.RuleId} onClick={this.enableRule} type={rule.Enabled ? "primary": "default"} size="default">
                    Monitor
                </Button>
            </Button.Group>,
                description: rule.Description
            }    
        });

        const mobileDataSource = this.props.Rules.map((rule, index) => {
            return {
                key: index.toString(),
                name: rule.Name,
                category: rule.Category,
                id: rule.RuleId,
                state2: <Switch checked={rule.Enabled} />,
                state: rule.Enabled ? "Monitor" : "Off",
                status:  <Button.Group>
                <Button name="off" id={rule.RuleId} onClick={this.toggleRule} style={{ backgroundColor: rule.Enabled ? "white" : "#27ae60", color: rule.Enabled ? "black" : "white" }} size="default">
                    OFF
                </Button>
                <Button name="monitor" id={rule.RuleId} onClick={this.toggleRule} style={{ backgroundColor: rule.Enabled ? "#27ae60" : "white", color: rule.Enabled ? "white" : "black" }} size="default">
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
            {
                title: 'State',
                dataIndex: 'state2',
                key: 'state2'
            }
          ];

          const mobileColumns = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
                sorter: (a, b) => a.name.length - b.name.length,
                sortDirections: ['descend', 'ascend']
            },
            {
              title: 'Status',
              dataIndex: 'state',
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
                            this.props.Rules.length === 0 && <Spin tip="Loading..." style={{ margin: "auto", width: "100%", fontSize: "2rem" }} size="large" />
                        }
                        {
                            this.props.Rules.length !== 0 && (
                                <div className="rules-header">
                                    <h1>Rules</h1>
                                </div>
                            )
                        }
                        
                        {this.props.Rules.length !== 0 && (
                                <div className="rules-options">
                                    <div className="rules-bulk-switch">
                                        <ButtonGroup>
                                            <Button size="large" onClick={this.disableAll}>Disable All</Button>
                                            <Button size="large" onClick={this.monitorAll}>Monitor All</Button>
                                        </ButtonGroup>
                                    </div>
                                </div>
                            )
                        }
                        <div className="web-rules">
                            {this.props.Rules.length !== 0 && <Table pagination={{ position: "bottom", pageSize: 8 }} style={{ width: "90%", margin: "auto", maxWidth: "1200px", border: "1px solid #CCC", borderRadius: "3px" }} dataSource={dataSource} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />}   
                        </div>
                        <div className="mobile-rules">
                            {this.props.Rules.length !== 0 && <Table pagination={{ position: "bottom", pageSize: 8 }} style={{ width: "90%", margin: "auto", border: "1px solid #CCC", borderRadius: "3px" }} dataSource={dataSource} columns={mobileColumns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />} 
                        </div>
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

export default connect(mapStateToProps, { saveUser, getRules, getCurrentUser, enableRule, disableRule, modifyRules })(RulesPage);