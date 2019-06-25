import React from 'react';
import { connect } from 'react-redux';
import { Button, Table, Spin, Column, Card } from 'antd';
import Loading from './Loading';
import RuleItem from './RuleItem';
import Header from './Header';
import TableHeader from './TableHeader';
import { saveUser, getRules, getCurrentUser, toggleRule } from '../actions';
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

    toggleFilterMenu = () => {
        this.setState({
            showFilters: !this.state.showFilters
        })
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
                <Button name="off" id={rule.RuleId} onClick={this.toggleRule} style={{ backgroundColor: rule.Enabled ? "white" : "#27ae60", color: rule.Enabled ? "black" : "white" }} size="large" onClick={this.toggleRule}>
                    OFF
                </Button>
                <Button name="monitor" id={rule.RuleId} onClick={this.toggleRule} style={{ backgroundColor: rule.Enabled ? "#27ae60" : "white", color: rule.Enabled ? "white" : "black" }} size="large" onClick={this.toggleRule}>
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
                        this.props.Rules.length === 0 && (
                            <Spin style={{ margin: "auto" }} size="large" />
                        )
                    }
                    <div className="rules-options">
                        {
                            this.props.Rules.length !== 0 && (
                                <div className="rules-bulk-switch">
                                    <ButtonGroup>
                                        <Button size="large">Disable All</Button>
                                        <Button size="large">Monitor All</Button>
                                        <Button size="large">Remediate All</Button>
                                    </ButtonGroup>
                                </div>
                            )
                        }
                    </div>
                    <Table pagination={{ position: "top" }} style={{ width: "90%", margin: "auto" }} dataSource={dataSource} columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} />
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

export default connect(mapStateToProps, { saveUser, getRules, getCurrentUser, toggleRule })(RulesPage);