import axios from 'axios';
import { Auth } from 'aws-amplify'

const purify = axios.create({
    baseURL: 'https://d4tr8itraa.execute-api.us-east-1.amazonaws.com/test',
    timeout: 5000
});

export const postTicket = (values, user) => async (dispatch, getState) => {
    console.log(values)
    let myRequest = {
        body: {
            ...values,
            CustomerId: user.CustomerId
        },
        headers: {
            Authorization: getState().user.IdToken
        }
    };
    console.log(myRequest);

    purify.post('/tickets', myRequest).then(
        response => {
            console.log(response);
    }).catch(err => console.log(err));
}

export const postAccount = (item, customerId) => async (dispatch, getState) => {

    console.log(item)
    console.log(customerId)
    let myRequest = {
        body: {
            ...item,
            CustomerId: customerId,
            Type: 'Master'
        },
        headers: {
            Authorization: getState().user.IdToken
        }
    };
    purify.post('/accounts', myRequest).then(
        response => {
            console.log(response);
    }).catch(err => console.log(err));
    dispatch({ type: 'ADD_ACCOUNT', payload: item });
}

export const updateAccount = (account, role) => async (dispatch, getState) => {
    console.log(account);
    console.log(role);

    let RoleArn = 'arn:aws:iam::' + account.AccountId + ':role/' + role;

    let myRequest = {
        body: {
            ...account,
            RoleName: role,
            Role: RoleArn
        },
        headers: {
            Authorization: getState().user.IdToken
        }
    };

    const response = await purify.put('/accounts', myRequest).catch(err => console.log(err));

    console.log(response);
    dispatch({ type: 'UPDATE_ACCOUNT', payload: myRequest.body });
}

export const getAccounts = (id) => async (dispatch, getState) => {
    console.log(id);

    let myRequest = {
        body: {},
        headers: {
            Authorization: getState().user.IdToken
        }
    }

    const accountResponse = await purify.get('/accounts?id=' + id, myRequest).catch(err => console.log(err));
    console.log(accountResponse);
    const Items = accountResponse.data.Items.map(item => {
        return {
            AccountId: item.AccountId.S,
            Provider: item.Provider.S,
            Role: (item.Role && item.Role.S) || 'None',
            Type: item.Type.S || 'Secondary',
            RoleName: (item.RoleName && item.RoleName.S) || 'None',
            CustomerId: item.CustomerId.S,
            Status: item.Status.S
        }
    });
    dispatch({ type: 'FETCH_ACCOUNTS', payload: Items });
}

export const getSettings = (customerId) => async (dispatch, getState) => {
    let myRequest = {
        body: { customerId },
        headers: {
            Authorization: getState().user.IdToken
        }
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
            Image: item.Image.S || "None",
            Color: item.FeatureBackground.S
        }
    });
    dispatch({ type: 'FETCH_FEATURES', payload: Items });
}

export const saveUser = (user) => async (dispatch, getState) => {

    let myRequest = {
        body: {},
        headers: {
            "x-api-key": 'jvtFUGnz5U3o1ZYNAMm9V6ELYaUthXTO9GcUSy6y'
        }
    }

    if(user && user["custom:company"])
    {
        const customerResponse = await purify.get('/customers?company=' + user["custom:company"], myRequest);
        console.log(customerResponse)
        user.customerId = customerResponse.data[0].CustomerId.S
    }
    dispatch({ type: 'STORE_USER', payload: user })
}

export const getCurrentUser = () => async dispatch => {
    const user = await Auth.currentAuthenticatedUser()
    console.log(user);
    let myRequest = {
        body: {},
        headers: {
            "x-api-key": 'jvtFUGnz5U3o1ZYNAMm9V6ELYaUthXTO9GcUSy6y'
        }
    }

    const customerResponse = await purify.get('/customers?company=' + user.attributes["custom:company"], myRequest);
    console.log(customerResponse)
    const userInfo = {
        ...user.attributes,
        IdToken: user.signInUserSession.idToken.jwtToken,
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
    const customerResponse = await purify.get('/customers' + queryString)
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

export const getRules = (user) => async dispatch => {

    let myRequest = {
        body: {},
        headers: {
            Authorization: user.IdToken
        }
    }
    console.log(user);
    const { CustomerId } = user;
    console.log(CustomerId)
    const rulesResponse = await purify.get('/rules?id=' + CustomerId, myRequest);
    console.log(rulesResponse.data);
    const Items = rulesResponse.data.map(item => {
        return {
            CustomerId: item.CustomerId.S,
            RuleId: item.RuleId.S,
            Name: item.Name.S,
            Category: item.Category.S,
            Description: item.Description.S,
            Enabled: item.Enabled.BOOL,
            Violations: item.Violations.L.map(violation => {
                return {
                    ViolationDate: violation.M.ViolationDate.S
                }
            })
        }
    });
    dispatch({ type: 'FETCH_RULES', payload: Items });
}

export const toggleRule = (id, user) => async (dispatch, getState) => {

    console.log(user)
    const prevState = getState();
    let myRequest = {
        body: { },
        headers: {
            Authorization: user.IdToken
        }
    }

    console.log(myRequest);

    let newRules = prevState.rules.map(rule => {

            if(rule.RuleId === id)
            {
                myRequest.body = {
                    ...rule,
                    Enabled: !rule.Enabled
                };
                console.log(myRequest);
                purify.put('/rules', myRequest).catch(err => console.log(err));
                return {
                    ...rule,
                    Enabled: !rule.Enabled
                }
            }
            else 
            {
                return rule
            }   
    });

    console.log(newRules);
    dispatch({ type: 'TOGGLE_RULE', payload: newRules });
}

export const toggleAWS = () => async (dispatch, getState) => {
    console.log(getState().settings);
    const customerId = getState().user.CustomerId;
    console.log(customerId);
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
    let myRequest = {
        body: {
            customerId,
            Setting: "Providers",
            NewValue: newValue
        },
        headers: {
            Authorization: getState().user.IdToken
        }
    }
    dispatch({ type: 'TOGGLE_AWS', payload: newValue });
    const settingsUpdateResponse = await purify.put('/settings', myRequest);
    console.log(settingsUpdateResponse);
}

export const toggleAddAccount = () => async (dispatch, getState) => {
    const prevState = getState();
    console.log(prevState);

    dispatch({type: 'TOGGLE_ADD_ACCOUNT', payload: !prevState.flags.AddAccount })
}

export const toggleSettingsMenu = (menu) => async dispatch => {
        dispatch({ type: 'TOGGLE_MENU', payload: menu })
}

export const fetchTickets = () => async (dispatch, getState) => {

    let myRequest = {
        body: {},
        headers: {
            Authorization: getState().user.IdToken
        }
    }

    const ticketResponse = await purify.get('/tickets?id=' + getState().user.CustomerId, myRequest);

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
