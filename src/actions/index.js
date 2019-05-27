import axios from 'axios';
import { Auth } from 'aws-amplify'

const purify = axios.create({
    baseURL: 'https://d4tr8itraa.execute-api.us-east-1.amazonaws.com/test',
    timeout: 5000
});

export const postTicket = (values) => async dispatch => {
    console.log(values)
    let myRequest = {
        body: {
            ...values,
            CustomerId: '3432332'
        }
    };

    purify.post('/tickets', myRequest).then(
        response => {
            console.log(response);
    }).catch(err => console.log(err));
}

export const postAccount = (item, customerId) => async dispatch => {

    console.log(item)
    console.log(customerId)
    let myRequest = {
        body: {
            ...item,
            CustomerId: customerId || 'Admin1',
            Type: 'Master'
        }
    };
    purify.post('/accounts', myRequest).then(
        response => {
            console.log(response);
    }).catch(err => console.log(err));
    dispatch({ type: 'ADD_ACCOUNT', payload: item });
}

export const getAccounts = (id) => async dispatch => {
    console.log(id);

    const accountResponse = await purify.get('/accounts?id=' + id).catch(err => console.log(err));
    console.log(accountResponse);
    const Items = accountResponse.data.Items.map(item => {
        return {
            AccountId: item.AccountId.S,
            Provider: item.Provider.S,
            RoleName: (item.Role && item.Role.S) || 'None'
        }
    });
    dispatch({ type: 'FETCH_ACCOUNTS', payload: Items });
}

export const getSettings = (customerId) => async dispatch => {
    let myRequest = {
        body: { customerId }
    }
    const response = await purify.get('/settings', myRequest)
    console.log(response)
    const settings =  {
        Providers: response.data[0].Providers.L.map(provider => {
            return {
                Name: provider.M.Name.S,
                Enabled: provider.M.Enabled.BOOL
            }
        })
    }

    dispatch({ type: 'FETCH_SETTINGS', payload: settings })
}

export const getFeatures = () => async dispatch => {
    let myRequest = {
        body: {}
    };
    const featureResponse = await purify.get('/features', myRequest);
    console.log(featureResponse);
    const Items = featureResponse.data.Items.map(item => {
        return {
            FeatureId: item.FeatureId.S,
            Title: item.Title.S,
            Description: item.Description.S,
        }
    });
    dispatch({ type: 'FETCH_FEATURES', payload: Items });
}

export const saveUser = (user) => async dispatch => {

    if(user && user["custom:company"])
    {
        const customerResponse = await purify.get('/customers?company=' + user["custom:company"]);
        console.log(customerResponse)
        user.customerId = customerResponse.data[0].CustomerId.S
    }
    dispatch({ type: 'STORE_USER', payload: user })
}

export const getCurrentUser = () => async dispatch => {
    const user = await Auth.currentAuthenticatedUser()
    console.log(user)
    const customerResponse = await purify.get('/customers?company=' + user.attributes["custom:company"]);
    console.log(customerResponse)
    const userInfo = {
        ...user.attributes,
        CustomerId: (customerResponse.data.length > 0 && customerResponse.data[0].CustomerId.S) || "None",
        Key: (customerResponse.data.length > 0 && customerResponse.data[0].ApiKey.S) || "None"
    }

    dispatch({ type: 'STORE_USER', payload: userInfo })
}

export const validateCompany = async (user) => {
    console.log(user);
    let myRequest = {
        body:   { 
                    email: user.email, 
                    company: user.company,
                    userName: user.username
                }
    };

    let postResponse;

    let queryString = '?company=' + user.company;
    const customerResponse = await purify.get('/customers' + queryString, myRequest)
    console.log(customerResponse);

    if(customerResponse.data.length === 0)
    {
        postResponse = await purify.put('/customers', myRequest)
        console.log(postResponse);
        
    }
    else
    {
        console.log("Company already exists. No further action needed.")
    }
};

export const getRules = (CustomerId) => async dispatch => {
    console.log(CustomerId)
    const rulesResponse = await purify.get('/rules?id=' + CustomerId)
    console.log(rulesResponse);
    const Items = rulesResponse.data.map(item => {
        return {
            CustomerId: item.CustomerId.S,
            RuleId: item.RuleId.S,
            Name: item.Name.S,
            Category: item.Category.S,
            Description: item.Description.S,
            Enabled: item.Enabled.BOOL
        }
    });
    dispatch({ type: 'FETCH_RULES', payload: Items });
}

export const toggleRule = (id) => async (dispatch, getState) => {

    const prevState = getState();

    let newRule = prevState.rules.filter(rule => rule.RuleId === id).map(rule => {
            return {
                ...rule,
                Enabled: !rule.Enabled
            }
    });

    console.log(newRule);

    dispatch({ type: 'TOGGLE_RULE', payload: newRule[0] });

    let myRequest = {
        body: newRule[0]
    }

    const ruleResponse = await purify.put('/rules', myRequest);
    console.log(ruleResponse);
}

export const toggleAWS = () => async (dispatch, getState) => {
    console.log(getState().settings);
    const newValue = getState().settings.Providers.map(provider => {
        if(provider.Name === 'AWS')
        {
            return {
                Name: 'AWS',
                Enabled: !provider.Enabled
            }
        }
        else
        {
            return provider
        }
    });
    console.log(newValue);
    dispatch({ type: 'TOGGLE_AWS', payload: newValue });
}

export const toggleAddAccount = () => async (dispatch, getState) => {
    const prevState = getState();
    console.log(prevState);

    dispatch({type: 'TOGGLE_ADD_ACCOUNT', payload: !prevState.flags.AddAccount })
}

export const toggleSettingsMenu = (menu) => async dispatch => {
        dispatch({ type: 'TOGGLE_MENU', payload: menu })
}

export const fetchTickets = () => async dispatch => {
    const ticketResponse = await purify.get('/tickets');

    console.log(ticketResponse);

    const items = ticketResponse.data.map(item => {
        return { 
            CustomerId: item.CustomerId.S,
            TicketId: item.TicketId.S,
            Headline: (item.Headline && item.Headline.S) || "None",
            Description: (item.Description && item.Description.S) || "None"
        }
    });

    dispatch({ type: 'FETCH_TICKETS', payload: items })
}

export const showMobile = () => async (dispatch, getState) => {
    const state = getState();
    console.log(state);
    dispatch({ type: 'TOGGLE_MOBILE', payload: !state.mobile.mobileMenu });
}
