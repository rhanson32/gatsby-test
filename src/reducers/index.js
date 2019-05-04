import { combineReducers } from 'redux';

const accountReducer = (state = [], action) => {
    switch(action.type)
    {
        case 'FETCH_ACCOUNTS':
            return [ ...action.payload ]
        default:
            return state;
    }

};

const ruleReducer = (state = [], action) => {
    switch(action.type)
    {
        case 'FETCH_RULES':
            return [ ...action.payload ]
        default:
            return state;
    }

};

export default combineReducers({
    accounts: accountReducer,
    rules: ruleReducer
});