import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import Header from './Header';
import TopMenu from './TopMenu';
import moment from 'moment';
import { Auth } from 'aws-amplify';
import { message } from 'antd';
import { Table } from 'tabler-react';
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
        return (
            <div className="history-page">
                <Header />
                <TopMenu />
                <div className="history-main">
                    <div className="history-max">
                        <div className="support-screen-header">
                            <h1>History</h1>
                        </div>
                        <Table>
                            <Table.Header>
                                <Table.ColHeader>
                                    Event Date
                                </Table.ColHeader>
                                <Table.ColHeader>
                                    Event
                                </Table.ColHeader>
                                <Table.ColHeader>
                                    Event Data
                                </Table.ColHeader>
                            </Table.Header>
                            <Table.Body>
                            <Table.Row>
                                <Table.Col>
                                    {this.props.history.length && this.props.history[0].ActionDate}
                                </Table.Col>
                                <Table.Col>
                                    {this.props.history.length && this.props.history[0].Event}
                                </Table.Col>
                                <Table.Col>
                                    {this.props.history.length && this.props.history[0].EventData}
                                </Table.Col>
                            </Table.Row>
                            </Table.Body>
                        </Table>
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