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
    console.log(state);
    console.log(action);
    switch(action.type)
    {
        case 'FETCH_RULES':
            return [ ...action.payload ]
        case 'TOGGLE_RULE':
            return [ ...state.filter(rule => rule.RuleId !== action.payload.RuleId), ...action.payload ]
        default:
            return state;
    }

};

const flagReducer = (state = { AddAccount: false }, action) => {
    switch(action.type)
    {
        case 'TOGGLE_ADD_ACCOUNT':
            return { ...state, AddAccount: action.payload }
        default:
            return state;
    }
}

export default combineReducers({
    accounts: accountReducer,
    rules: ruleReducer,
    flags: flagReducer
});