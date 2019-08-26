import React from 'react';
import { Table } from 'tabler-react';
import { Button } from 'antd';
import moment from 'moment';

class ViolationTable extends React.Component {

    handleDefer = () => {
        console.log("Defer!");
    }

    handleDismiss = () => {
        console.log("Dismiss!");
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
                        this.props.rule.Violations.map((violation, index) => {
                            return (
                                <Table.Row>
                                    <Table.Col>
                                        {violation.ResourceId}
                                    </Table.Col>
                                    <Table.Col>
                                        {moment(violation.ViolationDate).format("MMMM Do YYYY, h:mm:ss a")}
                                    </Table.Col>
                                    <Table.Col>
                                        {violation.AccountId}
                                    </Table.Col>
                                    <Table.Col>
                                       
                                            <Button type="link" onClick={this.handleDefer}>
                                                Defer
                                            </Button>
                                            <Button type="link" onClick={this.handleDismiss}>
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

export default ViolationTable;