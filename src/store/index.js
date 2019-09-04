import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';

import reducer from '../reducers';

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composeEnhancers = process.env.COMPOSE || window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
);

export default store;