const AWS = require('aws-sdk');

let options = {
    endpoint: 'http://localhost:8000',
    region: 'local-env',
    sslEnabled: false,
};

const documentClient = new AWS.DynamoDB.DocumentClient(options);

const signUp = {

    async insertUser(data, TableName) {

        let response = {}

        if (!data.id && !data.username && !data.password) {
            response = {
                statusCode: 400,
                body: JSON.stringify({ msg: 'Invalid Inputs' })
            }
            
        }else{
            const params = {
                TableName,
                Item: data,
            };
    
            const res = await documentClient.put(params).promise();
    
            if (!res) {
                response = {
                    statusCode: 500,
                    body: JSON.stringify({ msg: 'Data not Inserted...' })
                }
            }else{
                response = {
                    statusCode: 200,
                    body: JSON.stringify(data)
                }
            }
        }

        return response;
    }
};

module.exports = signUp;