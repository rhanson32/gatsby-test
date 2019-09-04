import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';

import reducer from '../reducers';
console.log("Node version:",$NODE_VERSION);
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composeEnhancers = $COMPOSE || window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
);

export default store;