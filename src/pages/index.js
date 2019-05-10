import React from "react";
import { Link } from 'gatsby'

import Splash from "../components/Splash";
import Features from "../components/Features";
import SiteMap from "../components/SiteMap";
import '../styles/global.css';

import Amplify from 'aws-amplify'
import config from '../aws-exports'
Amplify.configure(config)

const IndexPage = () => (
    <div>
      <Splash />
      <Features />
      <SiteMap />
      <p>Create a new account: <Link to="/app/signup">Sign Up</Link></p>
      <Link to="/app/dashboard">Dashboard</Link><br />
      <Link to="/app/rules">Your rules</Link>
    </div>
)

export default IndexPage

// export default () => (
//   <div className="app">
//     <Splash />
//     <Features />
//     <SiteMap />
//   </div>
// )