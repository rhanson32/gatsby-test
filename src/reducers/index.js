import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'

const accountReducer = (state = [], action) => {

    console.log(action.payload);
    switch(action.type)
    {
        case 'FETCH_ACCOUNTS':
            return [ ...action.payload ]
        case 'UPDATE_ACCOUNT':
            return state.map(account => {
                    if(account.AccountId !== action.payload.AccountId)
                    {
                        return account
                    }
                    else
                    {
                        return action.payload
                    }
            })
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
            return [ ...action.payload ]
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

const ticketReducer = (state = [], action) => {
    switch(action.type)
    {
        case 'FETCH_TICKETS':
            return [ ...action.payload ]
        default:
            return state;
    }
}

const settingsReducer = (state = { }, action) => {
    switch(action.type)
    {
        case 'FETCH_SETTINGS':
            return action.payload
        case 'TOGGLE_AWS':
            return { ...state, Providers: action.payload }
        default:
            return state;
    }
}

const menuReducer = (state = { selected: 'General' }, action) => {
    switch(action.type)
    {
        case 'TOGGLE_MENU': 
            return { selected: action.payload }
        default: 
            return state;
    }
}

const mobileReducer = (state = { mobileMenu: false }, action) => {
    switch(action.type)
    {
        case 'TOGGLE_MOBILE': 
            return { mobileMenu: action.payload }
        default: 
            return state;
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
    menu: menuReducer,
    tickets: ticketReducer,
    mobile: mobileReducer
});