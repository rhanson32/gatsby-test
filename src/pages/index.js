import React from "react";
import { Link } from 'gatsby'

import Splash from "../components/Splash";

import '../styles/global.css';

import Amplify from 'aws-amplify'
import config from '../aws-exports'
Amplify.configure(config)

const IndexPage = () => (
    <div>
      <Splash />
      <p>Welcome to your new Gatsby site with multi-user authentication powered by <a href="https://amplify.aws">AWS Amplify</a></p>
      <p>Create a new account: <Link to="/app/signup">Sign Up</Link></p>
      <Link to="/app/login">Sign In</Link><br />
      <Link to="/app/dashboard">Home</Link><br />
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