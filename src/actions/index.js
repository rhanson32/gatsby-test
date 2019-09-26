import axios from 'axios';
import { Auth } from 'aws-amplify'

const purify = axios.create({
    baseURL: process.env.GATSBY_API_URL,
    timeout: 8000,
    headers: { 'X-Api-Key': process.env.GATSBY_API_KEY }
});

export const postTicket = (values) => async (dispatch, getState) => {

    let myRequest = {
        body: {
            ...values,
            CustomerId: getState().user.CustomerId
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
        }
    };

    let fullItem = {
        ...item,
        Type: 'Master',
        Status: 'New',
        RoleName: 'arn:aws:iam::' + item.AccountId + ':role/PurifyManager' 
    };

    dispatch({ type: 'ADD_ACCOUNT', payload: fullItem });

    purify.post('/accounts', myRequest).then(
        response => {
            console.log(response);
    }).catch(err => console.log(err));
    
}

export const updateUser = (user) => async dispatch => {
    let myRequest = {
        body: {
            ...user
        }
    };

    dispatch({ type: 'UPDATE_USER', payload: myRequest.body });
    await purify.patch('/users', myRequest).catch(err => console.log(err));
}

export const updateAccount = (account, role) => async (dispatch, getState) => {

    let RoleArn = 'arn:aws:iam::' + account.AccountId + ':role/' + role;

    let myRequest = {
        body: {
            ...account,
            RoleName: role,
            Role: RoleArn
        }
    };

    dispatch({ type: 'UPDATE_ACCOUNT', payload: myRequest.body });
    await purify.put('/accounts', myRequest).catch(err => console.log(err));
}

export const addGlobalNotification = (recipient) => async (dispatch, getState) => {
    let myRequest = {
        body: {
            event: 'ADD_GLOBAL_NOTIFICATION',
            recipient,
            CustomerId: getState().user.CustomerId
        }
    };
    let Notifications = getState().settings.Notifications;
    Notifications.push(recipient);

    dispatch({ type: 'ADD_NOTIFICATION', payload: Notifications });
    await purify.patch('/settings', myRequest).catch(err => console.log(err));
}

export const fetchDashboardData = (id) => async (dispatch, getState) => {

    const settings = purify.get('/settings?id=' + id);
    const users = purify.get('/users?id=' + id);
    const tickets = purify.get('/tickets?id=' + getState().user.CustomerId);

    axios.all([purify.get('/rules?id=' + id), purify.get('/metrics?id=' + id), purify.get('/accounts?id=' + id)])
        .then(axios.spread((rules, metrics, accounts) => {

            if(rules)
            {
                let Items = rules.data.map(item => {
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
                                AccountId: (violation.M.AccountId && violation.M.AccountId.S) || "Unknown",
                                Status: (violation.M.Status && violation.M.Status.S) || 'Active',
                                ResourceType: (violation.M.ResourceType && violation.M.ResourceType.S) || 'Unknown'
                            }
                        }),
                        Scanned: item.ScannedCount ? parseInt(item.ScannedCount.N) : 0
                    }
                });

                dispatch({ type: 'FETCH_RULES', payload: Items });
            }

            if(metrics)
            {
                dispatch({ type: 'FETCH_METRICS', payload: metrics.data });
            }

            if(accounts)
            {
                const accountItems = accounts.data.Items.map(item => {
                    return {
                        AccountId: item.AccountId.S,
                        Provider: item.Provider.S,
                        Role: (item.Role && item.Role.S) || 'None',
                        Type: item.Type.S || 'Secondary',
                        RoleName: (item.RoleName && item.RoleName.S) || 'None',
                        CustomerId: item.CustomerId.S,
                        Status: item.Status ? item.Status.S : 'Not Validated',
                        Enabled: (item.Enabled && item.Enabled.BOOL) || false
                    }
                });

                dispatch({ type: 'FETCH_ACCOUNTS', payload: accountItems });
            }

        }));

    axios.all([settings, users, tickets])
        .then(axios.spread((settingsResponse, usersResponse, ticketsResponse) => {

            if(usersResponse)
            {
                dispatch({ type: 'FETCH_USERS', payload: usersResponse.data });
            }

            if(settingsResponse)
            {
                try
                {
                    const settings =  {
                        Providers: settingsResponse.data.length === 0 ? [] : settingsResponse.data[0].Providers.L.map(provider => {
                            return {
                                Name: provider.M.Name.S,
                                Enabled: provider.M.Enabled.BOOL
                            }
                        }),
                        Notifications: settingsResponse.data.length === 0 ? [] : settingsResponse.data[0].Notifications.L.map(notification => notification.S),
                        saml: settingsResponse.data.length === 0 ? false : (settingsResponse.data[0].SAML && settingsResponse.data[0].SAML.BOOL) || false,
                        Metadata: settingsResponse.data.length === 0 ? null : settingsResponse.data[0].Metadata && settingsResponse.data[0].Metadata.S
                    }
                
                    dispatch({ type: 'FETCH_SETTINGS', payload: settings });
                    return { statusCode: 200 }
                }
                catch(err)
                {
                    console.log(err);
                    return { statusCode: 400, error: 'Unable to load settings data.' }
                }
            }

            if(ticketsResponse)
            {
                const items = ticketsResponse.data.map(item => {
                    return { 
                        CustomerId: item.CustomerId.S,
                        TicketId: item.TicketId.S,
                        Headline: (item.Headline && item.Headline.S) || "None",
                        Description: (item.Description && item.Description.S) || "None",
                        CreateDate: (item.CreateDate && item.CreateDate.S) || "Unknown",
                        Status: (item.Status && item.Status.S) || "Unassigned"
                    }
                });
            
                dispatch({ type: 'FETCH_TICKETS', payload: items });
            }
        }));
}

export const removeGlobalNotification = (recipient) => async (dispatch, getState) => {
    let myRequest = {
        body: {
            event: 'REMOVE_GLOBAL_NOTIFICATION',
            CustomerId: getState().user.CustomerId,
            recipient
        }
    };

    let Notifications = getState().settings.Notifications;
    Notifications = Notifications.filter(item => item !== recipient);

    dispatch({ type: 'REMOVE_NOTIFICATION', payload: Notifications });
    await purify.patch('/settings', myRequest).catch(err => console.log(err));
}

export const fetchUsers = (id) => async (dispatch, getState) => {

    const usersResponse = await purify.get('/users?id=' + id).catch(err => console.log(err));

    if(usersResponse)
    {
        dispatch({ type: 'FETCH_USERS', payload: usersResponse.data });
    }
}

export const getMetrics = (id) => async dispatch => {

    const metricResponse = await purify.get('/metrics?id=' + id).catch(err => console.log(err));

    if(metricResponse)
    {
        dispatch({ type: 'FETCH_METRICS', payload: metricResponse.data });
    }

    return true;
}

export const getAccounts = (id) => async dispatch => {

    const accountResponse = await purify.get('/accounts?id=' + id).catch(err => console.log(err));

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
                Status: item.Status ? item.Status.S : 'Not Validated',
                Enabled: (item.Enabled && item.Enabled.BOOL) || false
            }
        });
        dispatch({ type: 'FETCH_ACCOUNTS', payload: Items });
        return { statusCode: 200 };
    }
    else
    {
        return { statusCode: 400, error: 'Unable to retrieve account data. '}
    }
}

export const updateCustomerStatus = (status) => async (dispatch, getState) => {
    const user = getState().user;

    let myRequest = {
        body: {
            CustomerId: user.CustomerId,
            status: status
        }
    };

    dispatch({ type: 'UPDATE_STATUS', payload: status });
    const response = await purify.post('/customers', myRequest).catch(err => console.log(err));
    console.log(response);
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
    else if(action === 'dismissViolation')
    {
        rules = rules.map(rule => {
            if(rule.RuleId === id)
            {
                return {
                    ...rule
                }
            }
            else
            {
                return rule;
            }
        })
        dispatch({ type: 'DISMISS_VIOLATION', payload: rules });
    }

    await purify.post('/rules', myRequest).catch(err => console.log(err));
}

export const downgradeSubscription = () => async (dispatch, getState) => {

    const id = getState().user.CustomerId;

    console.log(id);

    let myRequest = {
        body: {
            id,
            plan: 'Free'
        }
    }

    await purify.patch('/stripe', myRequest).then(data => {
        console.log('Success');
        dispatch({ type: 'UPDATE_PLAN', payload: 'Free' });
    }).catch(err => {
        console.log(err);
        return false;
    });
}

export const submitSubscription = (id, user, discount) => async dispatch => {

    const { email, CustomerId } = user;

    let myRequest = {
        body: { 
            id,
            email,
            CustomerId,
            discount
        }
    };

    console.log(id);

    await purify.post('/stripe', myRequest).then(data => {
        console.log('Success');
        dispatch({ type: 'UPDATE_PLAN', payload: 'Standard' });
    }).catch(err => {
        console.log(err);
        return false;
    });
    return true;
}

export const getSettings = (customerId) => async dispatch => {

    const response = await purify.get('/settings?id=' + customerId).catch(err => console.log(err));

    if(response)
    {
        try
        {
            const settings =  {
                Providers: response.data.length === 0 ? [] : response.data[0].Providers.L.map(provider => {
                    return {
                        Name: provider.M.Name.S,
                        Enabled: provider.M.Enabled.BOOL
                    }
                }),
                Notifications: response.data.length === 0 ? [] : response.data[0].Notifications.L.map(notification => notification.S),
                saml: response.data.length === 0 ? false : (response.data[0].SAML && response.data[0].SAML.BOOL) || false,
                Metadata: response.data.length === 0 ? null : response.data[0].Metadata && response.data[0].Metadata.S
            }
        
            dispatch({ type: 'FETCH_SETTINGS', payload: settings });
            return { statusCode: 200 }
        }
        catch(err)
        {
            console.log(err);
            return { statusCode: 400, error: 'Unable to load settings data.' }
        }
    }
    else
    {
        return { statusCode: 400, error: 'Unable to load settings data.' }
    }
}

export const manageViolations = (event) => async dispatch => {
    let myRequest = {
        body: event
    };

    dispatch({ type: 'MANAGE_VIOLATION', payload: event });
    await purify.patch('/rules', myRequest).catch(err => console.log(err));
}

export const uploadMetadata = (file) => async (dispatch, getState) => {
    let myRequest = {
        body: {
            metadataFile: file,
            CustomerId: getState().user.CustomerId
        }
    };

    console.log(myRequest);

    await purify.post('/saml', myRequest).catch(err => console.log(err));
}

export const saveUser = (user) => async (dispatch, getState) => {

    dispatch({ type: 'STORE_USER', payload: user });

    if(user && user["custom:company"])
    {
        const customerResponse = await purify.get('/customers?company=' + user["custom:company"]);
        console.log(customerResponse);
        user.customerId = customerResponse.data[0].CustomerId.S;
    }
}

export const addDefaultGroup = (token) => async dispatch => {

    const groupName = token.identities[0].providerName.replace('SSO', 'Auditors');

    let myRequest = {
        body: {
            name: groupName,
            user: token["cognito:username"]
        }
    };

    await purify.post('/groups', myRequest).catch(err => console.log(err));
}

export const getCurrentUser = () => async dispatch => {
    const purifyUser = JSON.parse(localStorage.getItem('purifyUser'));

    if(purifyUser.type === 'federated')
    {
        const customerResponse = await purify.get('/customers?client=' + purifyUser.client).catch(err => console.log(err));

        const userInfo = {
            CustomerId: (customerResponse.data.length > 0 && customerResponse.data[0].CustomerId.S) || "None",
            Key: (customerResponse.data.length > 0 && customerResponse.data[0].ApiKey.S) || "None",
            Plan: customerResponse.data[0].Plan.S,
            Status: customerResponse.data[0].Status.S,
            Client: customerResponse.data[0].ClientId.S,
            CreateDate: (customerResponse.data[0].CreateDate && customerResponse.data[0].CreateDate.N) || "None",
            Group: 'None',
            MFA: false,
            Type: 'Federated',
            email: customerResponse.data[0].Email.S
        }

        dispatch({ type: 'STORE_USER', payload: userInfo });
    }
    else
    {
        const user = await Auth.currentAuthenticatedUser().catch(err => {
            console.log(err);
        });

        const customerResponse = await purify.get('/customers?company=' + user.attributes["custom:company"]).catch(err => {
            console.log(err);
        });
        if(customerResponse && user)
        {
            const userInfo = {
                ...user.attributes,
                IdToken: user.signInUserSession.idToken.jwtToken,
                CustomerId: (customerResponse.data.length > 0 && customerResponse.data[0].CustomerId.S) || "None",
                Key: (customerResponse.data.length > 0 && customerResponse.data[0].ApiKey.S) || "None",
                Plan: customerResponse.data[0].Plan.S,
                SignedUrl: customerResponse.data[0].SignedUrl.S,
                Client: customerResponse.data[0].ClientId.S,
                Status: customerResponse.data[0].Status.S,
                CreateDate: customerResponse.data[0].CreateDate.N,
                Type: 'Native',
                Group: user.signInUserSession.idToken.payload['cognito:groups'][0],
                MFA: user.preferredMFA === 'SOFTWARE_TOKEN_MFA' ? true : false
            }
    
            dispatch({ type: 'STORE_USER', payload: userInfo });
        }
        
    } 
}

export const enableMFA = () => async dispatch => {
        dispatch({ type: 'ENABLE_MFA', payload: true });
}

export const disableMFA = () => async dispatch => {
    dispatch({ type: 'ENABLE_MFA', payload: false });
}

export const validateCompany = async (user) => {

    let myRequest = {
        body:   { 
                email: user.email, 
                company: user.company.trim().replace(/ /g, "-"),
                userName: user.username
            }
    };

    let queryString = '?company=' + user.company;
    const customerResponse = await purify.get('/customers' + queryString).catch(err => console.log(err));

    if(customerResponse.data.length === 0)
    {
        let createResponse = await purify.put('/customers', myRequest).catch(err => console.log(err));
        if(createResponse)
        {
            return {
                statusCode: 200
            }
        }
        
        return {
            statusCode: 400,
            error: 'Unable to create new account. Please contact support@purify.cloud.'
        }
    }
    else
    {
        return {
            statusCode: 400,
            error: 'Company record already exists.'
        }
    }
};

export const getToken = (inputs) => async dispatch => {

    const tokenResponse = await purify.get('/tokens?code=' + inputs.code + '&' + 'client_id=' + inputs.client_id)
    .catch(err => {
        console.log(err);
    });

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
        }
    };

    await purify.patch('/settings', myRequest).catch(err => console.log(err));
}

export const disableSaml = () => async (dispatch, getState) => {
    dispatch({ type: 'DISABLE_SAML', payload: false });

    let myRequest = {
        body: {
            event: 'DISABLE_SAML',
            CustomerId: getState().user.CustomerId
        }
    };

    await purify.patch('/settings', myRequest).catch(err => console.log(err));
}

export const getRules = (user) => async dispatch => {

    let Items;

    const { CustomerId } = user;

    const rulesResponse = await purify.get('/rules?id=' + CustomerId).catch(err => console.log(err));

    if(rulesResponse)
    {
        Items = rulesResponse.data.map(item => {
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
                        AccountId: (violation.M.AccountId && violation.M.AccountId.S) || "Unknown",
                        Status: (violation.M.Status && violation.M.Status.S) || 'Active',
                        ResourceType: (violation.M.ResourceType && violation.M.ResourceType.S) || 'Unknown'
                    }
                }),
                Scanned: item.ScannedCount ? parseInt(item.ScannedCount.N) : 0
            }
        });

        dispatch({ type: 'FETCH_RULES', payload: Items });
    }
}

export const testSaml = (formData) => async dispatch => {
    let myRequest = {
        body: { data: formData }
    };

    await purify.post('/saml', myRequest).catch(err => console.log(err));
}

export const addRuleNotification = (rule, email) => async dispatch => {
    let myRequest = {
        body: {
            id: rule.CustomerId,
            action: 'addNotification',
            email,
            ruleId: rule.RuleId
        }
    }

    const newRule = {
        ...rule,
        Notifications: [ ...rule.Notifications ]
    };

    console.log("Updated rule:", newRule);

    dispatch({ type: 'ADD_RULE_NOTIFICATION', payload: newRule });
    await purify.post('/rules', myRequest).catch(err => console.log(err));
}

export const removeRuleNotification = (id, email) => async (dispatch, getState) => {

    let rule = getState().rules.find(rule => rule.RuleId === id);

    let myRequest = {
        body: {
            action: 'removeNotification',
            email,
            ruleId: id,
            id: rule.CustomerId
        }
    };

    rule.Notifications = rule.Notifications.filter(notification => notification !== email);

    dispatch({ type: 'REMOVE_RULE_NOTIFICATION', payload: rule });
    await purify.post('/rules', myRequest).catch(err => console.log(err));
}

export const getHistory = (user) => async dispatch => {

    const { CustomerId } = user;

    const historyResponse = await purify.get('/history?id=' + CustomerId).catch(err => console.log(err));

    const Items = historyResponse ? historyResponse.data.map(item => {
        return {
            CustomerId: item.CustomerId.S,
            EventTime: parseInt(item.EventTime.N) * 1000,
            Event: item.Event.S,
            EventData: item.EventData ? Object.assign(...Object.entries(item.EventData.M).map(([k, v]) => ({[k]: v.S }))) : "None"
        }
    }) : [];
    dispatch({ type: 'FETCH_HISTORY', payload: Items });
}

export const disableRule = (id, user) => async (dispatch, getState) => {

    const prevState = getState();
    let myRequest = {
        body: { }
    };

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
        body: { }
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
        body: { }
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

    const customerId = getState().user.CustomerId;
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

    let myRequest = {
        body: {
            customerId,
            Setting: "Providers",
            NewValue: newValue
        }
    };

    dispatch({ type: 'TOGGLE_AWS', payload: newValue });
    await purify.put('/settings', myRequest).catch(err => console.log(err));
}

export const toggleAddAccount = () => async (dispatch, getState) => {
    const prevState = getState();

    dispatch({type: 'TOGGLE_ADD_ACCOUNT', payload: !prevState.flags.AddAccount })
}

export const toggleSettingsMenu = (menu) => async dispatch => {
        dispatch({ type: 'TOGGLE_MENU', payload: menu })
}

export const fetchTickets = () => async (dispatch, getState) => {

    const ticketResponse = await purify.get('/tickets?id=' + getState().user.CustomerId).catch(err => console.log(err));

    if(ticketResponse)
    {
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
    
        dispatch({ type: 'FETCH_TICKETS', payload: items });
    }
}

export const showMobile = () => async (dispatch, getState) => {
    const state = getState();
    dispatch({ type: 'TOGGLE_MOBILE', payload: !state.mobile.mobileMenu });
}

export const showDocumentation = (page) => async dispatch => {
    dispatch({ type: 'CHANGE_PAGE', payload: page});
}

export const addUser = (user) => async (dispatch, getState) => {
    let myRequest = {
        body: {
            ...user,
            company: getState().user['custom:company']
        }
    }

    console.log(user);
    dispatch({ type: 'ADD_USER', payload: user });
    const response = await purify.post('/users', myRequest).catch(err => console.log(err));  
    return response;
}