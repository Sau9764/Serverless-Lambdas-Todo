const jwt = require('jsonwebtoken')

exports.handler = async event => {

    const tokenID = (event.headers && event.headers['X-Amz-Security-Token'] || event.headers['x-amz-security-token'])

    console.log('-------------->' + tokenID)

    if (!tokenID) {
        console.log('could not find a token on the event');
        return generatePolicy({ allow: false });
    }
    try {

        let decoded = jwt.verify(tokenID, 'secret_msg')

        if(decoded) {
            console.log('Token validated');
            return generatePolicy({ allow: true });
        }
        
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