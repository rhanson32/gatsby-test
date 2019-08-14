import axios from 'axios';
import { Auth } from 'aws-amplify'

const purify = axios.create({
    baseURL: 'https://d4tr8itraa.execute-api.us-east-1.amazonaws.com/test',
    timeout: 8000
});

export const postTicket = (values) => async (dispatch, getState) => {
    console.log(values);
    let myRequest = {
        body: {
            ...values,
            CustomerId: getState().user.CustomerId
        },
        headers: {
            "x-api-key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    };
    console.log(myRequest);

    const ticketResponse = await purify.post('/tickets', myRequest).catch(err => console.log(err));

    console.log(ticketResponse);

    dispatch({ type: 'POST_TICKET', payload: ticketResponse.data });
}

export const postAccount = (item, customerId) => async (dispatch, getState) => {

    let myRequest = {
        body: {
            ...item,
            CustomerId: customerId,
            Type: 'Master',
            Status: 'New'
        },
        headers: {
            "x-api-key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
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
            "x-api-key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    };

    dispatch({ type: 'UPDATE_ACCOUNT', payload: myRequest.body });
    const response = await purify.put('/accounts', myRequest).catch(err => console.log(err));

    console.log(response);
    
}

export const addGlobalNotification = (recipient) => async (dispatch, getState) => {
    let myRequest = {
        body: {
            event: 'ADD_GLOBAL_NOTIFICATION',
            recipient,
            CustomerId: getState().user.CustomerId
        },
        headers: { "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih' }
    };
    console.log(recipient);
    console.log(getState());
    console.log(getState().settings);
    let Notifications = getState().settings.Notifications;
    Notifications.push(recipient);

    console.log(myRequest);
    dispatch({ type: 'ADD_NOTIFICATION', payload: Notifications });
    const response = await purify.patch('/settings', myRequest).catch(err => console.log(err));
    console.log(response);
}

export const removeGlobalNotification = (recipient) => async (dispatch, getState) => {
    let myRequest = {
        body: {
            event: 'REMOVE_GLOBAL_NOTIFICATION',
            CustomerId: getState().user.CustomerId,
            recipient
        },
        headers: { "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih' }
    };

    let Notifications = getState().settings.Notifications;
    Notifications = Notifications.filter(item => item !== recipient);

    dispatch({ type: 'REMOVE_NOTIFICATION', payload: Notifications });
    const response = await purify.patch('/settings', myRequest).catch(err => console.log(err));
}

export const fetchUsers = (id) => async (dispatch, getState) => {
    let myRequest = {
        body: {},
        headers: { "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih' }
    }

    const usersResponse = await purify.get('/users?id=' + id, myRequest).catch(err => console.log(err));

    if(usersResponse)
    {
        dispatch({ type: 'FETCH_USERS', payload: usersResponse.data });
    }
}

export const getAccounts = (id) => async (dispatch, getState) => {

    let myRequest = {
        body: {},
        headers: { "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih' }
    }

    const accountResponse = await purify.get('/accounts?id=' + id, myRequest).catch(err => console.log(err));

    if(accountResponse)
    {
        const Items = accountResponse.data.Items.map(item => {
            return {
                AccountId: item.AccountId.S,
                Provider: item.Provider.S,
                Role: (item.Role && item.Role.S) || 'None',
                Type: item.Type.S || 'Secondary',
                RoleName: (item.RoleName && item.RoleName.S) || 'None',
                CustomerId: item.CustomerId.S,
                Status: item.Status.S,
                Enabled: item.Enabled.BOOL
            }
        });
        dispatch({ type: 'FETCH_ACCOUNTS', payload: Items });
        return accountResponse.ScannedCount;
    }
    
}

export const updateCustomerStatus = (status) => async (dispatch, getState) => {
    const user = getState().user;
    console.log(user);

    let myRequest = {
        body: {
            CustomerId: user.CustomerId,
            status: status
        },
        headers: {
            'X-Api-Key': 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    };

    const response = await purify.post('/customers', myRequest).catch(err => console.log(err));
    console.log(response);

    dispatch({ type: 'UPDATE_STATUS', payload: status });
}

export const modifyRules = (action, id, email) => async (dispatch, getState) => {
    let myRequest = {
        body: { 
            action,
            id,
            email
         }
    };

    let rules = getState().rules;
    if(action === 'disable')
    {
        rules = rules.map(rule => {
            return {
                ...rule,
                Enabled: false
            }
        });

        dispatch({ type: 'UPDATE_RULES', payload: rules });
    }
    else if(action === 'monitor')
    {
        rules = rules.map(rule => {
            return {
                ...rule,
                Enabled: true
            }
        });

        dispatch({ type: 'UPDATE_RULES', payload: rules });
    }
    else if(action === 'addNotification')
    {
        rules = rules.map(rule => {
            if(rule.RuleId === id)
            {
                return {
                    ...rule,
                    Notifications: [ ...rule.Notifications, email]
                }
            }
            else
            {
                return rule;
            }
        })
        dispatch({ type: 'ADD_RULE_NOTIFICATION', payload: rules });
    }

    await purify.post('/rules', myRequest).catch(err => console.log(err));
}

export const submitSubscription = (id, user, discount) => async dispatch => {

    console.log(user);
    const { email, CustomerId } = user;

    let myRequest = {
        body: { 
            id,
            email,
            CustomerId,
            discount
        },
        headers: { "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih' }
    };

    console.log(id);

    await purify.post('/stripe', myRequest).then(data => {
        console.log(data);
        dispatch({ type: 'UPDATE_PLAN', payload: 'Standard' });
    }).catch(err => {
        console.log(err);
    });
   

    
}

export const getSettings = (customerId) => async (dispatch, getState) => {
    let myRequest = {
        body: { },
        headers: {
            "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    }

    console.log(myRequest);
    const response = await purify.get('/settings?id=' + customerId, myRequest).catch(err => console.log(err));

    console.log(response);

    const settings =  {
        Providers: response.data[0].Providers.L.map(provider => {
            return {
                Name: provider.M.Name.S,
                Enabled: provider.M.Enabled.BOOL
            }
        }),
        Notifications: response.data[0].Notifications.L.map(notification => notification.S),
        saml: response.data[0].SAML.BOOL
    }

    dispatch({ type: 'FETCH_SETTINGS', payload: settings })
}

export const uploadMetadata = (file) => async (dispatch, getState) => {
    let myRequest = {
        body: {
            metadatafile: file,
            CustomerId: getState().user.CustomerId
        },
        headers: {
            'X-Api-Key': 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    };

    const response = await purify.post('/saml', myRequest).catch(err => console.log(err));

    console.log(response);

}

export const getFeatures = () => async dispatch => {
    let myRequest = {
        body: {},
        headers: {
            'X-Api-Key': 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    };
    const featureResponse = await purify.get('/features', myRequest).catch(err => console.log(err));
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
            "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    }

    dispatch({ type: 'STORE_USER', payload: user });

    if(user && user["custom:company"])
    {
        const customerResponse = await purify.get('/customers?company=' + user["custom:company"], myRequest);
        user.customerId = customerResponse.data[0].CustomerId.S
    }
    dispatch({ type: 'STORE_USER', payload: user });
}

export const addDefaultGroup = (token) => async dispatch => {

    const groupName = token.identities[0].providerName.replace('SSO', 'Auditors');

    let myRequest = {
        body: {
            name: groupName,
            user: token["cognito:username"]
        },
        headers: { "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih' }
    }

    const addResponse = await purify.post('/groups', myRequest).catch(err => console.log(err));

}

export const getCurrentUser = () => async dispatch => {
    const purifyUser = JSON.parse(localStorage.getItem('purifyUser'));
    console.log("User locally:", purifyUser);

    let myRequest = {
        body: {},
        headers: { "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih' }
    }

    if(purifyUser.type === 'federated')
    {
        const customerResponse = await purify.get('/customers?client=' + purifyUser.client, myRequest).catch(err => console.log(err));

        console.log(customerResponse);

        const userInfo = {
            CustomerId: (customerResponse.data.length > 0 && customerResponse.data[0].CustomerId.S) || "None",
            Key: (customerResponse.data.length > 0 && customerResponse.data[0].ApiKey.S) || "None",
            Plan: customerResponse.data[0].Plan.S,
            Status: customerResponse.data[0].Status.S,
            Group: 'None',
            MFA: false,
            Type: 'Federated',
            email: customerResponse.data[0].Email.S
        }

        dispatch({ type: 'STORE_USER', payload: userInfo });
    }
    else
    {
        const user = await Auth.currentAuthenticatedUser().catch(err => console.log(err));

        const customerResponse = await purify.get('/customers?company=' + user.attributes["custom:company"], myRequest);

        const userInfo = {
            ...user.attributes,
            IdToken: user.signInUserSession.idToken.jwtToken,
            CustomerId: (customerResponse.data.length > 0 && customerResponse.data[0].CustomerId.S) || "None",
            Key: (customerResponse.data.length > 0 && customerResponse.data[0].ApiKey.S) || "None",
            Plan: customerResponse.data[0].Plan.S,
            Status: customerResponse.data[0].Status.S,
            Type: 'Native',
            Group: user.signInUserSession.idToken.payload['cognito:groups'][0],
            MFA: user.preferredMFA === 'SOFTWARE_TOKEN_MFA' ? true : false
        }

        dispatch({ type: 'STORE_USER', payload: userInfo });
    } 
}

export const validateCompany = async (user) => {
    console.log(user);
    let myRequest = {
        body:   { 
                email: user.email, 
                company: user.company.replace(/ /g, "-"),
                userName: user.username
            },
        headers: { 'X-Api-Key': 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih' }
    };

    let postResponse;

    let queryString = '?company=' + user.company;
    const customerResponse = await purify.get('/customers' + queryString)
    console.log(customerResponse);

    if(customerResponse.data.length === 0)
    {
        postResponse = await purify.put('/customers', myRequest)
        console.log(postResponse);
        return true;
    }
    else
    {
        return false;
    }
};

export const getToken = (inputs) => async dispatch => {

    let myRequest = {
        body: {},
        headers: {
            "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    };

    const tokenResponse = await purify.get('/tokens?code=' + inputs.code + '&' + 'client_id=' + inputs.client_id, myRequest)
    .catch(err => {
        console.log(err);
    });
    console.log(tokenResponse);
    if(tokenResponse)
    {
        return tokenResponse;
    }
    else
    {
        return false;
    }
}

export const enableSaml = () => async (dispatch, getState) => {
    dispatch({ type: 'ENABLE_SAML', payload: true });

    let myRequest = {
        body: {
            event: 'ENABLE_SAML',
            CustomerId: getState().user.CustomerId
        },
        headers: { "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih' }
    };

    console.log(myRequest);

    const response = await purify.patch('/settings', myRequest).catch(err => console.log(err));
    console.log(response);
}

export const disableSaml = () => async (dispatch, getState) => {
    dispatch({ type: 'DISABLE_SAML', payload: false });

    let myRequest = {
        body: {
            event: 'DISABLE_SAML',
            CustomerId: getState().user.CustomerId
        },
        headers: { "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih' }
    };

    console.log(myRequest);

    const response = await purify.patch('/settings', myRequest).catch(err => console.log(err));
    console.log(response);
}

export const getRules = (user) => async dispatch => {

    let myRequest = {
        body: {},
        headers: {
            "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    }

    const { CustomerId } = user;

    const rulesResponse = await purify.get('/rules?id=' + CustomerId, myRequest);

    const Items = rulesResponse.data.map(item => {
        return {
            CustomerId: item.CustomerId.S,
            RuleId: item.RuleId.S,
            Name: item.Name.S,
            Category: item.Category.S,
            Description: item.Description.S,
            Enabled: item.Enabled.BOOL,
            Configurable: item.Configurable && item.Configurable.BOOL ? item.Configurable.BOOL : false,
            Notifications: item.Notifications && item.Notifications.L.map(violation => violation.S),
            Violations: item.Violations.L.map(violation => {
                return {
                    ViolationDate: violation.M.ViolationDate.S,
                    ResourceId: (violation.M.ResourceId && violation.M.ResourceId.S) || "None",
                    AccountId: (violation.M.AccountId && violation.M.AccountId.S) || "Unknown"
                }
            }),
            Scanned: item.ScannedCount ? parseInt(item.ScannedCount.N) : 0
        }
    });
    dispatch({ type: 'FETCH_RULES', payload: Items });
}

export const addRuleNotification = (rule, email) => async dispatch => {
    let myRequest = {
        body: {
            id: rule.CustomerId,
            action: 'addNotification',
            email,
            ruleId: rule.RuleId
        },
        headers: {
            'X-Api-Key': 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    }

    const response = await purify.post('/rules', myRequest).catch(err => console.log(err));

    const newRule = {
        ...rule,
        Notifications: [ ...rule.Notifications ]
    };

    console.log(newRule);

    dispatch({ type: 'ADD_RULE_NOTIFICATION', payload: newRule });

    console.log(response);
}

export const getHistory = (user) => async dispatch => {

    let myRequest = {
        body: {},
        headers: {
            "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    }

    const { CustomerId } = user;

    const historyResponse = await purify.get('/history?id=' + CustomerId, myRequest).catch(err => console.log(err));

    const Items = historyResponse.data.map(item => {
        return {
            CustomerId: item.CustomerId.S,
            ActionDate: item.ActionDate.S,
            Event: item.Event.S,
            EventData: item.EventData ? item.EventData.M : "None"
        }
    });
    dispatch({ type: 'FETCH_HISTORY', payload: Items });
}

export const disableRule = (id, user) => async (dispatch, getState) => {

    const prevState = getState();
    let myRequest = {
        body: { },
        headers: {
            "x-api-key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    }

    let newRules = prevState.rules.map(rule => {

            if(rule.RuleId === id && rule.Enabled)
            {
                myRequest.body = {
                    ...rule,
                    Enabled: false
                };

                purify.put('/rules', myRequest).catch(err => console.log(err));
                return {
                    ...rule,
                    Enabled: false
                }
            }
            else 
            {
                return rule
            }   
    });

    dispatch({ type: 'TOGGLE_RULE', payload: newRules });
}

export const enableRule = (id, user) => async (dispatch, getState) => {

    const prevState = getState();
    let myRequest = {
        body: { },
        headers: {
            "x-api-key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    }

    let newRules = prevState.rules.map(rule => {

            if(rule.RuleId === id && !rule.Enabled)
            {
                myRequest.body = {
                    ...rule,
                    Enabled: true
                };

                purify.put('/rules', myRequest).catch(err => console.log(err));
                return {
                    ...rule,
                    Enabled: true
                }
            }
            else 
            {
                return rule
            }   
    });

    dispatch({ type: 'TOGGLE_RULE', payload: newRules });
}

export const toggleRule = (id, user) => async (dispatch, getState) => {

    const prevState = getState();
    let myRequest = {
        body: { },
        headers: {
            "X-Api-Key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    }

    let newRules = prevState.rules.map(rule => {

            if(rule.RuleId === id)
            {
                myRequest.body = {
                    ...rule,
                    Enabled: !rule.Enabled
                };

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
            "x-api-key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
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
            "x-api-key": 'Bb6HQOL9MVV213PjU8Pj68xBJAvvBMx6GJlq83Ih'
        }
    }

    const ticketResponse = await purify.get('/tickets?id=' + getState().user.CustomerId, myRequest);

    const items = ticketResponse.data.map(item => {
        return { 
            CustomerId: item.CustomerId.S,
            TicketId: item.TicketId.S,
            Headline: (item.Headline && item.Headline.S) || "None",
            Description: (item.Description && item.Description.S) || "None",
            CreateDate: (item.CreateDate && item.CreateDate.S) || "Unknown",
            Status: (item.Status && item.Status.S) || "Unassigned"
        }
    });

    dispatch({ type: 'FETCH_TICKETS', payload: items })
}

export const showMobile = () => async (dispatch, getState) => {
    const state = getState();
    console.log(state);
    dispatch({ type: 'TOGGLE_MOBILE', payload: !state.mobile.mobileMenu });
}

export const showDocumentation = (page) => async dispatch => {
    dispatch({ type: 'CHANGE_PAGE', payload: page});
}

export const addUser = (user) => async (dispatch, getState) => {
    let myRequest = {
        body: {
            ...user,
            company: getState().user['custom:company'],
            password: 'Test1234!'
        }
    }
    const response = await purify.post('/users', myRequest).catch(err => console.log(err));
    console.log(response);
    dispatch({ type: 'ADD_USER', payload: user })
}

export const confirmUser = (username) => async dispatch => {

    const secondResponse = await Auth.completeNewPassword('reedhansontest1@gmail.com', "NewPass12!").catch(err => console.log(err));
}