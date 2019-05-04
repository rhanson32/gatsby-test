import React from "react";
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import Header from '../components/Header';
import AccountsPage from '../components/AccountsPage';
import reducer from '../reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
);

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