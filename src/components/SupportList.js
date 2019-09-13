import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { Table } from 'tabler-react';

class SupportList extends React.Component {

  state = {
    showDetail: false
  }

  showDetail = (id) => {
    console.log(id);
    this.setState({
      showDetail: true,
      detail: this.props.tickets.find(ticket => ticket.TicketId === id)
    });
  }

    render() {

        return (
            <div>
          <Table striped={true}>
            <Table.Header className="table-header-2">
              <Table.Row>
              <Table.ColHeader>
                ID
              </Table.ColHeader>
              <Table.ColHeader>
                Headline
              </Table.ColHeader>
              <Table.ColHeader>
                Status
              </Table.ColHeader>
              <Table.ColHeader>
                Detail
              </Table.ColHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.tickets.map((ticket, index) => {
                return (
                  <Table.Row key={index}>
                  <Table.Col>
                    {ticket.TicketId}
                  </Table.Col>
                  <Table.Col>
                    {ticket.Headline}
                  </Table.Col>
                  <Table.Col>
                    {ticket.Status}
                  </Table.Col>
                  <Table.Col>
                    <Button name={ticket.TicketId} type="link" onClick={() => this.showDetail(ticket.TicketId)}>
                      View
                    </Button>
                  </Table.Col>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
          <hr />
          {
            this.state.showDetail && (
              <div className="ticket-detail-pane">
                <div className="ticket-detail-pane-header">
                  Ticket Detail
                </div>
                <div className="ticket-detail-item">
                  <div className="ticket-detail-header">
                    Ticket ID
                  </div>
                  <div className="ticket-detail-content">
                    {this.state.detail.TicketId}
                  </div>
                </div>
                <div className="ticket-detail-item">
                  <div className="ticket-detail-header">
                    Status
                  </div>
                  <div className="ticket-detail-content">
                    {this.state.detail.Status}
                  </div>
                </div>
                <div className="ticket-detail-item">
                  <div className="ticket-detail-header">
                    Headline
                  </div>
                  <div className="ticket-detail-content">
                    {this.state.detail.Headline}
                  </div>
                </div>
                <div className="ticket-detail-item">
                  <div className="ticket-detail-header">
                    Description
                  </div>
                  <div className="ticket-detail-content">
                    {this.state.detail.Description}
                  </div>
                </div>
                {this.state.detail.Notes && (
                  <div>
                    {this.state.detail.Notes.map(note => {
                      return (
                        <div>
                          Test data
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }
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