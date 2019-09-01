import React from 'react';
import { Table } from 'tabler-react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { manageViolations } from '../actions';
import moment from 'moment';

class ViolationTable extends React.Component {

    handleDefer = (e) => {
        this.props.manageViolations({
            id: this.props.rule.RuleId,
            resourceId: e.target.name,
            action: 'defer',
            customerId: this.props.user.CustomerId,
            accountId: this.props.rule.Violations.find(violation => violation.ResourceId === e.target.name).AccountId,
            type: this.props.rule.Violations.find(violation => violation.ResourceId === e.target.name).ResourceType,
            category: this.props.rule.Category
        });
    }

    handleDismiss = (e) => {
        this.props.manageViolations({
            id: this.props.rule.RuleId,
            resourceId: e.target.name,
            action: 'dismiss',
            customerId: this.props.user.CustomerId,
            accountId: this.props.rule.Violations.find(violation => violation.ResourceId === e.target.name).AccountId,
            type: this.props.rule.Violations.find(violation => violation.ResourceId === e.target.name).ResourceType,
            category: this.props.rule.Category
        });
    }

    render() {
        return (
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.ColHeader>
                            Resource Identifier
                        </Table.ColHeader>
                        <Table.ColHeader>
                            Violation Date
                        </Table.ColHeader>
                        <Table.ColHeader>
                            Account ID
                        </Table.ColHeader>
                        <Table.ColHeader>
                            Actions
                        </Table.ColHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        this.props.rule.Violations.filter(violation => !violation.Status || (violation.Status && violation.Status === 'Active')).map((violation, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Col>
                                        {violation.ResourceId}
                                    </Table.Col>
                                    <Table.Col>
                                        {moment(parseInt(violation.ViolationDate) * 1000).format("MMM Do YYYY, h:mm:ss a")}
                                    </Table.Col>
                                    <Table.Col>
                                        {violation.AccountId}
                                    </Table.Col>
                                    <Table.Col>
                                       
                                            <Button type="link" account={violation.AccountId} name={violation.ResourceId} onClick={this.handleDefer}>
                                                Defer
                                            </Button>
                                            <Button type="link" name={violation.ResourceId} onClick={this.handleDismiss}>
                                                Dismiss
                                            </Button>
                                        
                                    </Table.Col>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
        )
    }

}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { manageViolations })(ViolationTable);