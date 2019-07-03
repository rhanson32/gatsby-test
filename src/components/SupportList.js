import React from 'react';
import { connect } from 'react-redux';
import { Button, Table, Spin, Column, Card } from 'antd';

class SupportList extends React.Component {

    render() {
        const dataSource = this.props.tickets.map((ticket, index) => {
            return {
                key: index.toString(),
                headline: ticket.Headline,
                description: ticket.Description,
                id: ticket.TicketId 
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
            }
          ];

        return (
            <div>

        {this.props.tickets.length !== 0 && <Table pagination={{ position: "bottom" }} style={{ width: "100%", margin: "auto", minHeight: "300px", maxWidth: "1400px" }} dataSource={dataSource} columns={columns} />} 

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