import React from "react"
import { Router } from "@reach/router"
import { Provider } from 'react-redux'

import Login from "../components/Login"
import SignUp from "../components/SignUp"
import PrivateRoute from "../components/PrivateRoute"
import Dashboard from '../components/Dashboard';
import RulesPage from '../components/RulesPage';
import AccountsPage from '../components/AccountsPage'
import Features from '../components/Features'
import Home from '../components/Home'
import Pricing from '../components/Pricing'
import SupportPage from '../components/SupportPage'
import Settings from '../components/Settings'
import Docs from '../components/Docs';
import Users from '../components/Users';
import History from '../components/History';
import Payment from '../components/Payment';

import store from '../store'

const App = () => (
    <Provider store={store}>
        <Router>
            <Home path="/" />
            <PrivateRoute path="app/dashboard" component={Dashboard} />
            <PrivateRoute path="/app/rules" component={RulesPage} />
            <PrivateRoute path="/app/accounts" component={AccountsPage} />
            <PrivateRoute path="/app/users" component={Users} />
            <PrivateRoute path="/app/settings" component={Settings} />
            <PrivateRoute path="/app/support" component={SupportPage} />
            <PrivateRoute path="/app/history" component={History} />
            <PrivateRoute path="/app/payment" component={Payment} />
            <Login path="/app/login" />
            <SignUp path="/app/signup" />
            <Features path="/app/features" />
            <Pricing path="/app/pricing" />
            <Docs path="/app/docs" />
        </Router>
    </Provider>
  )
  
  export default App;