import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'

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
        case 'TOGGLE_RULE':
            return [ ...state.filter(rule => rule.RuleId !== action.payload.RuleId), ...action.payload ]
        default:
            return state;
    }

};

const featureReducer = (state = [], action) => {

    switch(action.type)
    {
        case 'FETCH_FEATURES':
            return [ ...action.payload ]
        default:
            return state;
    }
};

const userReducer = (state = {}, action) => {

    switch(action.type)
    {
        case 'STORE_USER':
            return action.payload
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

const settingsReducer = (state = { }, action) => {
    switch(action.type)
    {
        case 'FETCH_SETTINGS':
            return action.payload
        default:
            return state;
    }
}

const menuReducer = (state = { }, action) => {
    switch(action.type)
    {
        case 'TOGGLE_MENU': 
            return { selected: action.payload }
        default: 
            return { selected: 'General' };
    }
}

export default combineReducers({
    accounts: accountReducer,
    rules: ruleReducer,
    flags: flagReducer,
    features: featureReducer,
    user: userReducer,
    settings: settingsReducer,
    form: formReducer,
    menu: menuReducer
});