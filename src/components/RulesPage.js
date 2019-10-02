import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import moment from 'moment';
import SwitchWrap from './SwitchWrap';
import { getExpiration } from '../utils/auth';
import { Button, Table, Spin, message, Drawer, Modal } from 'antd';
import Header from './Header';
import Footer from './Footer';
import { getRules, getCurrentUser, getAccounts, getHistory, getMetrics, fetchUsers, fetchTickets, enableRule, disableRule, modifyRules } from '../actions';
import RuleItem from './RuleItem';
import TopMenu from './TopMenu';

class RulesPage extends React.Component {

    state = {
        showFilters: false,
        Category: "All",
        Status: "All",
        visible: false,
        description: ``,
        title: ``,
        ruleId: null
    }

    componentDidMount = async () => {
        const user = await getCurrentUser();
        if(moment(getExpiration()) < moment())
        {
            console.log("User session has expired");
            message.warning('Your session has expired. Redirecting to login page in 2 seconds.');
            if(user.type !== 'federated')
            {
                setTimeout(async () => {
                    await Auth.signOut();
                    navigate('/app/login');
                }, 2000); 
            }
            else
            {
                setTimeout(async () => {
                    navigate('/app/login');
                }, 2000); 
            }   
        }
        if(!this.props.User.email)
        {
            await this.props.getCurrentUser();
            this.props.getRules(this.props.User);
        }
        else {
            this.props.getRules(this.props.User);
        }
        if(!this.props.metrics || this.props.metrics.PurifyScore)
        {
            this.props.getMetrics(this.props.User.CustomerId);
        }
        if(this.props.accounts.length === 0)
        {
            this.props.getAccounts(this.props.User.CustomerId);
        }
        this.props.fetchUsers(this.props.User.CustomerId);
        this.props.fetchTickets();
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
 
        this.setState({
            description: this.props.Rules.find(rule => rule.Name === e.target.name).Description,
            visible: true,
            title: this.props.Rules.find(rule => rule.Name === e.target.name).Name,
            ruleId: this.props.Rules.find(rule => rule.Name === e.target.name).RuleId
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
                  <div className="rules-table-name">
                      {record.name}
                      <Button name={record.name} type="link" onClick={this.showDetail}>View</Button>
                  </div>
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
            <div className="rules-page">
                <Header />  
                <TopMenu />
                    <div className="rules">
                        <div className="rules-max">
                        {
                            this.props.Rules.length === 0 && <Spin tip="Loading..." style={{ margin: "auto", width: "100%", fontSize: "2rem" }} size="large" />
                        }
                        <div className="rules-header-new">
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
                        </div>
                        <div className="web-rules">
                            {this.props.Rules.length !== 0 && <Table pagination={{ position: "bottom", pageSize: 8 }} dataSource={dataSource} columns={columns} />}   
                        </div>
                        <div className="mobile-rules">
                            {this.props.Rules.length !== 0 && <Table pagination={{ position: "bottom", pageSize: 8 }} bordered style={{ width: "90%", margin: "auto" }} dataSource={dataSource} columns={mobileColumns} />} 
                        </div>
                        </div>
                        {/* <Drawer
                            title={this.state.title}
                            placement="right"
                            closable={false}
                            onClose={this.onClose}
                            visible={this.state.visible}
                            >
                            {this.state.ruleId !== null && <RuleItem ruleId={this.state.ruleId} />}
                        </Drawer> */}
                        <Modal
                            visible={this.state.visible && this.state.ruleId !== null}
                            footer={null}
                            onOk={this.onClose}
                            onCancel={this.onClose}
                        >
                            {this.state.ruleId !== null && <RuleItem ruleId={this.state.ruleId} />}
                        </Modal>
                    </div> 
                  <Footer />  
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        Rules: state.rules,
        User: state.user,
        metrics: state.metrics,
        history: state.history,
        accounts: state.accounts
    }
}

export default connect(mapStateToProps, { getRules, getAccounts, getHistory, getMetrics, fetchUsers, fetchTickets, getCurrentUser, enableRule, disableRule, modifyRules })(RulesPage);