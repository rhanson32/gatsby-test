import axios from 'axios';

const purify = axios.create({
    baseURL: 'https://d4tr8itraa.execute-api.us-east-1.amazonaws.com/test',
    timeout: 4000
});

export const postAccount = (item, customerId) => async dispatch => {

    console.log(item)
    console.log(customerId)
    let myRequest = {
        body: {
            ...item,
            CustomerId: customerId
        }
    };
    purify.post('/accounts', myRequest).then(
        response => {
            console.log(response);
    }).catch(err => console.log(err));
    dispatch({ type: 'ADD_ACCOUNT', payload: item });
}

export const getAccounts = () => async dispatch => {
    let myRequest = {
        body: {}
    };
    const accountResponse = await purify.get('/accounts', myRequest).catch(err => console.log(err));
    console.log(accountResponse);
    const Items = accountResponse.data.Items.map(item => {
        return {
            AccountId: item.AccountId.S,
            Provider: item.Provider.S,
            RoleName: item.RoleName.S
        }
    });
    dispatch({ type: 'FETCH_ACCOUNTS', payload: Items });
}

export const removeAccount = () => async dispatch => {

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
    const rulesResponse = await purify.get('/rules=?id=' + CustomerId)
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

export const toggleAddAccount = () => async (dispatch, getState) => {
    const prevState = getState();
    console.log(prevState);

    dispatch({type: 'TOGGLE_ADD_ACCOUNT', payload: !prevState.flags.AddAccount })
}
