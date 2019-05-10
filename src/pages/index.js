import React from "react";

import Splash from "../components/Splash";
import FeatureSummary from "../components/FeatureSummary";
import SiteMap from "../components/SiteMap";
import '../styles/global.css';

import Amplify from 'aws-amplify'
import config from '../aws-exports'
Amplify.configure(config)

const IndexPage = () => (
    <div>
      <Splash />
      <FeatureSummary />
      <SiteMap />
    </div>
)

export default IndexPage