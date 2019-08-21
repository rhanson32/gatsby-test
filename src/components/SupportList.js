import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'tabler-react';

class SupportList extends React.Component {

    render() {

        return (
            <div>
          <Table striped={true}>
            <Table.Header className="table-header-2">
              <Table.ColHeader>
                ID
              </Table.ColHeader>
              <Table.ColHeader>
                Headline
              </Table.ColHeader>
              <Table.ColHeader>
                Description
              </Table.ColHeader>
              <Table.ColHeader>
                Status
              </Table.ColHeader>
            </Table.Header>
            <Table.Body>
              {this.props.tickets.map((ticket, index) => {
                return (
                  <Table.Row>
                  <Table.Col>
                    {ticket.TicketId}
                  </Table.Col>
                  <Table.Col>
                    {ticket.Headline}
                  </Table.Col>
                  <Table.Col>
                    {ticket.Description}
                  </Table.Col>
                  <Table.Col>
                    {ticket.Status}
                  </Table.Col>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
         </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        tickets: state.tickets
    }
}

export default connect(mapStateToProps, null)(SupportList);