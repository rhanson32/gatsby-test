import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'tabler-react';

class SupportList extends React.Component {

    render() {
        const dataSource = this.props.tickets.map((ticket, index) => {
            return {
                key: index.toString(),
                headline: ticket.Headline,
                description: ticket.Description,
                id: ticket.TicketId,
                status: ticket.Status
            }    
        });

        const columns = [
            {
              title: 'Id',
              dataIndex: 'id',
              key: 'id'
            },
            {
              title: 'Headline',
              dataIndex: 'headline',
              key: 'headline'
            },
            {
              title: 'Description',
              dataIndex: 'description',
              key: 'description'
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status'
            }
          ];

        return (
            <div>

        {/* {this.props.tickets.length !== 0 && <Table bordered pagination={{ position: "bottom", pageSize: 8, hideOnSinglePage: true }} footer={() => 'You may also reach us with any questions at support@purify.cloud.'} style={{ width: "100%", margin: "auto", minHeight: "300px", maxWidth: "1400px" }} dataSource={dataSource} columns={columns} />}  */}
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