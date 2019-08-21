import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import Header from './Header';
import TopMenu from './TopMenu';
import moment from 'moment';
import { Auth } from 'aws-amplify';
import { message } from 'antd';
import { Table } from 'antd';
import { getExpiration } from '../utils/auth';
import { getHistory, getCurrentUser } from '../actions';

class History extends React.Component {

    componentDidMount = async () => {
        if(moment(getExpiration()) < moment())
        {
            console.log("User session has expired");
            message.warning('Your session has expired. Redirecting to login page in 2 seconds.');
            setTimeout(async () => {
                await Auth.signOut();
                navigate('/app/login');
            }, 2000); 
        }
        if(!this.props.user.email)
        {
            await this.props.getCurrentUser();
            this.props.getHistory(this.props.user);
        }
        else {
            this.props.getHistory(this.props.user);
        }
    }

    render() {

        const dataSource = this.props.history.map((item, index) => {
            return {
                key: index.toString(),
                actionDate: moment(item.ActionDate).format('MM/DD/YYYY hh:mm'),
                event: item.Event,
                eventData: JSON.stringify(item.EventData)
            }    
        });
          
        const columns = [
            {
              title: 'Action Date',
              dataIndex: 'actionDate',
              key: 'actionDate',
                sorter: (a, b) => moment(a.actionDate) - moment(b.actionDate),
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
                    <div className="history-max">
                        <div className="support-screen-header">
                            <h1>Audit Log</h1>
                        </div>
                        <Table pagination={{ position: "bottom", pageSize: 8 }} dataSource={dataSource} columns={columns} />
                    </div>
                </div>    
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