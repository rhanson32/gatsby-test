import React from "react"
import { Router } from "@reach/router"

import Login from "../components/Login"
import SignUp from "../components/SignUp"
import PrivateRoute from "../components/PrivateRoute"
import Dashboard from '../components/Dashboard';
import RulesPage from '../components/RulesPage';
import Header from '../components/Header';

const App = () => (
    <div>
        <Header />
        <Router>
            <PrivateRoute path="/app/dashboard" component={Dashboard} />
            <PrivateRoute path="/app/rules" component={RulesPage} />
            <Login path="/app/login" />
            <SignUp path="/app/signup" />
        </Router>
    </div>
    
  )
  
  export default App