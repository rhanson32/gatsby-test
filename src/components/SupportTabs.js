import { Card } from 'antd';
import { connect } from 'react-redux';
import AWSAccount from './AWSAccount';
import AddAccount from './AddAccount';
import SupportList from './SupportList';
import SupportForm from './SupportForm';
import React from 'react';

class SupportTabs extends React.Component {
  state = {
    noTitleKey: 'Tickets',
    showKey: false
  };

  showKey = () => {
    this.setState({
        showKey: !this.state.showKey
    })
}

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  render() {
    const tabListNoTitle = [
        {
          key: 'Tickets',
          tab: 'My Tickets',
        },
        {
          key: 'NewTicket',
          tab: 'New Ticket',
        }
      ];

      const dataSource = this.props.accounts.map((account, index) => {
        return {
            key: (index + 1).toString(),
            accountId: account.AccountId,
            provider: account.Provider,
            roleName: account.RoleName,
            status: account.Status,
            type: account.Type
        }
    });
      
      const columns = [
          {
              title: 'Account Id',
              dataIndex: 'accountId',
              key: 'accountId'
          },
          {
              title: 'Provider',
              dataIndex: 'provider',
              key: 'provider'
          },
          {
              title: 'Status',
              dataIndex: 'status',
              key: 'status'
          },
          {
              title: 'Role',
              dataIndex: 'roleName',
              key: 'roleName'
          }
      ];
      
      const contentListNoTitle = {
        Tickets: <SupportList count={this.props.tickets.length} items={this.props.tickets} />,
        NewTicket: <SupportForm onSubmit={this.submit} /> 
      };

    return (
        <Card
          style={{ width: '95%', minHeight: "60vh" }}
          tabList={tabListNoTitle}
          activeTabKey={this.state.noTitleKey}
          onTabChange={key => {
            this.onTabChange(key, 'noTitleKey');
          }}
        >
          {contentListNoTitle[this.state.noTitleKey]}
        </Card>
    );
  }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        settings: state.settings,
        user: state.user,
        tickets: state.tickets
    }
}

export default connect(mapStateToProps, null)(SupportTabs);