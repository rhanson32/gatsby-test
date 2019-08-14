import React from 'react';
import { Table } from 'tabler-react';

class ViolationTable extends React.Component {
    render() {
        console.log(this.props);
        return (
            <Table>
                <Table.Header>
                    <Table.ColHeader>
                        Resource Identifier
                    </Table.ColHeader>
                    <Table.ColHeader>
                        Violation Date
                    </Table.ColHeader>
                    <Table.ColHeader>
                        Account ID
                    </Table.ColHeader>
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
                                        {violation.ViolationDate}
                                    </Table.Col>
                                    <Table.Col>
                                        {violation.AccountId}
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