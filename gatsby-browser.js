/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import Amplify, { Auth } from 'aws-amplify'
import { setUser } from './src/utils/auth'
import 'normalize.css';
import "./src/styles/global.css";
import moment from 'moment';

Amplify.configure({
  Auth: {
      
      // REQUIRED - Amazon Cognito Region
      region: 'us-east-1',

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'us-east-1_wMiZuxWyI',

      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: '1ng8vh5ghq0jmjfcecloklp5jb'
  }
});

export const onRouteUpdate = (state, page, pages) => {
  Auth.currentAuthenticatedUser()
    .then(user => {
      const userInfo = {
        ...user.attributes,
        username: user.username,
        expiration: localStorage.getItem('purifyUser').expiration || null
      }
      setUser(userInfo)
    })
    .catch(err => {
      window.localStorage.setItem('gatsbyUser', null)
    })
}
