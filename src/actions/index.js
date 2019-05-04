import Amplify, { API } from 'aws-amplify';

const AWS = require('aws-sdk');

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

export const fetchData = async (dispatch) => {
    const dynamo = new AWS.DynamoDB();

    const response = await dynamo.scan({
        TableName: 'Slimcloud_Accounts'
    }).promise();

    response.then(data => console.log(data));
}

export const postAccount = (item) => async dispatch => {
    let myRequest = {
        body: {}
    };
    API.post('Accounts', '/accounts', myRequest).then(
        response => {
            console.log(response);
    }).catch(err => console.log(err));
    dispatch({ type: 'ADD_ACCOUNT', payload: item });
}

export const getAccounts = () => async dispatch => {
    let myRequest = {
        body: {}
    };
    const accountResponse = await API.get('Accounts', '/accounts', myRequest);
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
            RuleId: item.RuleId.S,
            Provider: item.Provider.S,
            Category: item.Category.S,
            Description: item.Description.S,
            Status: item.Status.S
        }
    });
    dispatch({ type: 'FETCH_RULES', payload: Items });
}
