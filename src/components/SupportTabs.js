import { Card } from 'antd';
import { connect } from 'react-redux';
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
      
      const contentListNoTitle = {
        Tickets: <SupportList count={this.props.tickets.length} items={this.props.tickets} />,
        NewTicket: <SupportForm onSubmit={this.submit} /> 
      };

    return (
        <Card
          style={{ width: '80%', minHeight: "60vh", margin: "4rem auto", border: "1px solid #CCC", borderRadius: "3px" }}
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