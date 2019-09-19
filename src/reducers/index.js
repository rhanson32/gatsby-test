import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'

const accountReducer = (state = [], action) => {

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
            });
        case 'ADD_ACCOUNT': 
            return [ ...state, action.payload ]
        default:
            return state;
    }

};

const metricReducer = (state = {}, action) => {

    switch(action.type)
    {
        case 'FETCH_METRICS':
            return { ...action.payload }
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
        case 'UPDATE_RULES':
            return [ ...action.payload ]
        case 'ADD_RULE_NOTIFICATION':
            return state.map(rule => {
                if(rule.RuleId === action.payload.RuleId)
                {
                    return action.payload
                }
                else
                {
                    return rule
                }
            });
        case 'MANAGE_VIOLATION':
            return state.map(rule => {
                if(rule.RuleId === action.payload.id)
                {
                    return {
                        ...rule,
                        Violations: rule.Violations.map(violation => {
                            if(violation.ResourceId === action.payload.resourceId)
                            {
                                return {
                                    ...violation,
                                    Status: action.payload.action === 'defer' ? 'Deferred' : 'Dismissed'
                                }
                            }
                            else
                            {
                                return violation;
                            }
                        })
                    }
                }
                else
                {
                    return rule;
                }
            })
        default:
            return state;
    }

};

const historyReducer = (state = [], action) => {

    switch(action.type)
    {
        case 'FETCH_HISTORY':
            return [ ...action.payload ]
        default:
            return state;
    }

};

const usersReducer = (state = [], action) => {

    switch(action.type)
    {
        case 'FETCH_USERS':
            return [ ...action.payload ]
        case 'ADD_USER': 
            return [ ...state, { Username: action.payload.email, Group: action.payload.group === 'Administrator' ? 'Administrators' : 'Auditors', Type: 'Purify' }]
        case 'UPDATE_USER':
            return state.map(user => {
                if(user.Sub === action.payload.sub)
                {
                    return {
                        ...user,
                        Group: action.payload.group
                    }
                }
                else
                {
                    return user
                }
            })
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
        case 'UPDATE_STATUS':
            return { ...state, Status: action.payload }
        case 'UPDATE_PLAN':
            return { ...state, Plan: action.payload }
        case 'UPDATE_USER':
            return { ...state, Group: action.payload.group }
        case 'ENABLE_MFA':
            return { ...state, MFA: action.payload }
        case 'DISABLE_MFA':
            return { ...state, MFA: action.payload }
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

const documentationReducer = (state = 'Prerequisites', action) => {
    
    switch(action.type)
    {
        case 'CHANGE_PAGE':
            return action.payload
        default:
            return state;
    }
}

const ticketReducer = (state = [], action) => {
    switch(action.type)
    {
        case 'FETCH_TICKETS':
            return [ ...action.payload ]
        case 'POST_TICKET': 
            return [ ...action.payload ]
        default:
            return state;
    }
}

const settingsReducer = (state = { Providers: [ ], Notifications: [ ] }, action) => {
    switch(action.type)
    {
        case 'FETCH_SETTINGS':
            return { ...action.payload }
        case 'TOGGLE_AWS':
            return { ...state, Providers: action.payload }
        case 'ADD_NOTIFICATION': 
            return { ...state, Notifications: action.payload }
        case 'REMOVE_NOTIFICATION': 
            return { ...state, Notifications: action.payload }
        case 'ENABLE_SAML': 
            return { ...state, saml: action.payload }
        case 'DISABLE_SAML': 
            return { ...state, saml: action.payload }
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

const mobileReducer = (state = { mobileMenu: true }, action) => {
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
    mobile: mobileReducer,
    documentation: documentationReducer,
    users: usersReducer,
    history: historyReducer,
    metrics: metricReducer
});