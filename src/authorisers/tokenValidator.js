const AWS = require('aws-sdk')

exports.handler = async event => {

    const Dynamo = new AWS.DynamoDB.DocumentClient()

    const tokenID = (event.headers && event.headers['X-Amz-Security-Token']) || '123'

    if (!tokenID) {
        console.log('could not find a token on the event');
        return generatePolicy({ allow: false });
    }
    try {
        const token = await Dynamo.get({Key: {id: tokenID}, TableName: 'authTokenTable1' }).promise()

        if (!token.Item) {
            console.log(`no token for token ID of ${tokenID}`);
            return generatePolicy({ allow: false });
        }
        
        return generatePolicy({ allow: true });

    } catch (error) {
        console.log('error ', error);
        return generatePolicy({ allow: false });
    }
}

const generatePolicy = ({ allow }) => {
    return {
        principalId: 'token',
        policyDocument: {
            Version: '2012-10-17',
            Statement: {
                Action: 'execute-api:Invoke',
                Effect: allow ? 'Allow' : 'Deny',
                Resource: '*',
            },
        },
    };
};