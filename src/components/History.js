import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import Header from './Header';
import Footer from './Footer';
import TopMenu from './TopMenu';
import moment from 'moment';
import { Auth } from 'aws-amplify';
import { message } from 'antd';
import { Table } from 'antd';
import { getExpiration } from '../utils/auth';
import { getHistory, getCurrentUser } from '../actions';
import DashboardOverlay from './DashboardOverlay';

class History extends React.Component {

    state = {
        scanComplete: false
    }

    componentDidMount = async () => {

        if(this.props.history.length > 0)
        {
            this.setState({ scanComplete: true });
        }
        if(moment(getExpiration()) < moment())
        {
            console.log("User session has expired");
            message.warning('Your session has expired. Redirecting to login page in 2 seconds.');
            if(this.props.user.type !== 'federated')
            {
                setTimeout(async () => {
                    await Auth.signOut();
                    navigate('/app/login');
                }, 2000); 
            }
            else
            {
                setTimeout(async () => {
                    navigate('/app/login');
                }, 2000); 
            }
            
        }
        if(!this.props.user.email)
        {
            await this.props.getCurrentUser();
            await this.props.getHistory(this.props.user);
        }
        else {
            await this.props.getHistory(this.props.user);
        }

        this.setState({ scanComplete: true });
    }

    render() {

        const dataSource = this.props.history.map((item, index) => {
            return {
                key: index.toString(),
                eventTime: moment(item.EventTime).format('MM/DD/YYYY hh:mm a'),
                event: item.Event,
                eventData: <pre>{JSON.stringify(item.EventData, null, 2)}</pre>
            }    
        });
          
        const columns = [
            {
              title: 'Event Time',
              dataIndex: 'eventTime',
              key: 'eventTime',
                sorter: (a, b) => moment(a.eventTime) - moment(b.eventTime),
                sortDirections: ['descend', 'ascend']
            },
            {
              title: 'Event',
              dataIndex: 'event',
              key: 'event',
              filters: [
                {
                  text: 'Found Violation',
                  value: 'FoundViolation',
                },
                {
                  text: 'Fixed Violation',
                  value: 'FixedViolation',
                }
              ],
                onFilter: (value, record) => record.event.indexOf(value) === 0,
                sorter: (a, b) => a.event.length - b.event.length,
                sortDirections: ['descend', 'ascend']
            },
            {
                title: 'Event Data',
                dataIndex: 'eventData',
                key: 'eventData'
            }
          ];

        return (
            <div className="history-page">
                <Header />
                <TopMenu />
                <div className="history-main">
                    {this.state.scanComplete && (
                         <div className="history-max">
                            <div className="support-screen-header">
                                <h1>Audit Log</h1>
                            </div>
                            <Table pagination={{ position: "bottom", pageSize: 8 }} dataSource={dataSource} columns={columns} />
                        </div>
                    )}
                   {!this.state.scanComplete && <DashboardOverlay />}
                </div> 
                <Footer />   
            </div>
        )
    }
};

const mapStateToProps = state => {
    return {
        history: state.history,
        user: state.user
    }
}

export default connect(mapStateToProps, { getHistory, getCurrentUser })(History);