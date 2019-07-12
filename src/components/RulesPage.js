import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { Link } from 'gatsby';
import moment from 'moment';
import SwitchWrap from './SwitchWrap';
import { getExpiration } from '../utils/auth';
import { Button, Table, Spin, message, Drawer } from 'antd';
import Header from './Header';
import { saveUser, getRules, getCurrentUser, enableRule, disableRule, modifyRules } from '../actions';
import LeftMenu from './LeftMenu';
import RuleItem from './RuleItem';

class RulesPage extends React.Component {

    state = {
        showFilters: false,
        Category: "All",
        Status: "All",
        visible: false,
        description: ``,
        title: ``,
        rule: null
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

    onClose = () => {
        this.setState({
            visible: false,
        });
        };

    toggleFilterMenu = () => {
        this.setState({
            showFilters: !this.state.showFilters
        });
    }

    showDetail = (e) => {
        console.log(e.target.name);
        console.log(e.target);
        console.log(this.props.Rules);
        this.setState({
            description: this.props.Rules.filter(rule => rule.Name === e.target.name)[0].Description,
            visible: true,
            title: this.props.Rules.filter(rule => rule.Name === e.target.name)[0].Name,
            rule: this.props.Rules.filter(rule => rule.Name === e.target.name)[0]
        });
        console.log(this.state);
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
                state2: <SwitchWrap checked={rule.Enabled} id={rule.RuleId} />,
                mode: 'Monitor',
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
          
        const columns = [
            {
              title: 'Name',
              render: (text, record) => (
                  <span>
                      {record.name}
                      <Button name={record.name} type="link" onClick={this.showDetail}>View</Button>
                  </span>
              ),
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
                title: 'State',
                dataIndex: 'state2',
                key: 'state2'
            },
            {
                title: 'Mode',
                dataIndex: 'mode',
                key: 'mode'
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
                            {this.props.Rules.length !== 0 && <Table pagination={{ position: "bottom", pageSize: 10 }} style={{ width: "90%", margin: "auto", maxWidth: "1000px", border: "1px solid #CCC", borderRadius: "3px" }} dataSource={dataSource} columns={columns} />}   
                        </div>
                        <div className="mobile-rules">
                            {this.props.Rules.length !== 0 && <Table pagination={{ position: "bottom", pageSize: 8 }} style={{ width: "90%", margin: "auto", border: "1px solid #CCC", borderRadius: "3px" }} dataSource={dataSource} columns={mobileColumns} />} 
                        </div>
                    </div> 
                </div>
                <Drawer
                        title={this.state.title}
                        placement="right"
                        closable={false}
                        onClose={this.onClose}
                        visible={this.state.visible}
                        >
                        {this.state.ruleId !== null && <RuleItem rule={this.state.rule} />}
                </Drawer>
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