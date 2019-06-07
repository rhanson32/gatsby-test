import React from 'react'
import ExternalHeader from './ExternalHeader';
import SiteMap from './SiteMap';

const NotFound = () => (
  <div className="not-found">
    <ExternalHeader />
    <h1>You have tried to access a page that does not exist. Use the links above to get back to civilization</h1>
    <SiteMap />
  </div>
)

export default NotFound;