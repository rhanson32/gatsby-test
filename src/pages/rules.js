import React from "react";
import { Provider } from 'react-redux';

import Header from '../components/Header';
import RulesPage from '../components/RulesPage';
import store from '../store';

class Rules extends React.Component { 
    
    render() {
        return (
            <Provider store={store}>
                <div className="app">
                    <Header />
                    <RulesPage />
                </div>
            </Provider>
        )
    }
}

export default Rules;