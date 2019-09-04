import { Card } from 'antd';
import { connect } from 'react-redux';
import SupportList from './SupportList';
import React from 'react';

class SupportTabs extends React.Component {
  state = {
    noTitleKey: 'Cases',
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
          key: 'Cases',
          tab: 'My Cases',
        }
      ];
      
      const contentListNoTitle = {
        Cases: <SupportList count={this.props.tickets.length} items={this.props.tickets} /> 
      };

    return (
      <div className="support-container">
        {
          (this.props.tickets.length > 0 || this.props.scanComplete) && (
            <div>
            <div className="web-rules">
              <Card
                style={{ width: '100%', minHeight: "60vh", boxShadow: "0 0 8px 2px #ddd", borderRadius: "3px" }}
                tabList={tabListNoTitle}
                activeTabKey={this.state.noTitleKey}
                onTabChange={key => {
                  this.onTabChange(key, 'noTitleKey');
                }}
              >
                {contentListNoTitle[this.state.noTitleKey]}
              </Card>
            </div>
            <div className="mobile-rules">
              <Card
                style={{ width: '90%', minHeight: "60vh", margin: "4rem 3%", border: "1px solid #CCC", borderRadius: "3px" }}
                tabList={tabListNoTitle}
                activeTabKey={this.state.noTitleKey}
                onTabChange={key => {
                  this.onTabChange(key, 'noTitleKey');
                }}
              >
                {contentListNoTitle[this.state.noTitleKey]}
              </Card>
            </div>
            </div>
          )
        }
        
      </div>
        
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