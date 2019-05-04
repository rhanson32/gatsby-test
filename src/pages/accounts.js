import React from "react";
import { Provider } from 'react-redux';
import Header from '../components/Header';
import AccountsPage from '../components/AccountsPage';
import store from '../store';

class Accounts extends React.Component {

    componentDidMount() {
        console.log("Mount up!");
    }

    render() {
        return (
            <Provider store={store}>
                <div className="app">
                    <Header />
                    <AccountsPage />
                </div>
            </Provider>
        )
    }
}

export default Accounts;