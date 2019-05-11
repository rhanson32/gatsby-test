import Amplify, { API } from 'aws-amplify';

Amplify.configure({
    API: {
        endpoints: [
            {
                name: "Accounts",
                endpoint: "https://d4tr8itraa.execute-api.us-east-1.amazonaws.com/test"
            }
        ]
    }
});

export const postAccount = (item) => async dispatch => {
    let myRequest = {
        body: {}
    };
    API.post('Accounts', '/accounts/', myRequest).then(
        response => {
            console.log(response);
    }).catch(err => console.log(err));
    dispatch({ type: 'ADD_ACCOUNT', payload: item });
}

export const getAccounts = () => async dispatch => {
    let myRequest = {
        body: {}
    };
    const accountResponse = await API.get('Accounts', '/accounts', myRequest).catch(err => console.log(err));
    console.log(accountResponse);
    const Items = accountResponse.Items.map(item => {
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

export const getRules = () => async dispatch => {
    let myRequest = {
        body: {}
    };
    const accountResponse = await API.get('Accounts', '/rules', myRequest);
    console.log(accountResponse);
    const Items = accountResponse.map(item => {
        return {
            CustomerId: item.CustomerId.S,
            RuleId: item.RuleId.S,
            Provider: item.Provider.S,
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

    const ruleResponse = await API.put('Accounts', '/rules', myRequest);
    console.log(ruleResponse);
}

export const toggleAddAccount = () => async (dispatch, getState) => {
    const prevState = getState();
    console.log(prevState);

    dispatch({type: 'TOGGLE_ADD_ACCOUNT', payload: !prevState.flags.AddAccount })
}
