// describes the table that we have

module.exports = {
    tables: [
        {
            TableName: 'TodoTable',
            KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
            AttributeDefinitions: [{AttributeName: 'id', AttributeType: 'S'}],
            BillingMode: 'PAY_PER_REQUEST',
        },

        {
            TableName: 'userTable',
            BillingMode: 'PAY_PER_REQUEST',
            KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
            AttributeDefinitions: [{AttributeName: 'id', AttributeType: 'S'}]
        }
    ]
}