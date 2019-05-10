import React from "react";
import Amplify, { Auth } from 'aws-amplify';
import awsmobile from '../aws-exports';
import { Provider } from 'react-redux';

import store from '../store';

import Header from '../components/Header';
import Dashboard from "../components/Dashboard";
Amplify.configure(awsmobile);

class DashboardPage extends React.Component{ 

  
  componentDidMount() {
    if(!this.state.Authenticated)
    {
      Auth.currentAuthenticatedUser().then(user => this.setState({ Authenticated: true })).catch(err => console.log(err));
    }
  }

  state = {
    Authenticated: false
  }

  render() {

    return (
        <Provider store={store}>
            <div className="app">
              <Header />
              <Dashboard />
            </div>
        </Provider>
    )
  }
}

export default DashboardPage;