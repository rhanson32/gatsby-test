import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import reducer from '../reducers';

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
);

export default store;