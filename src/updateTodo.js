const { v4 } = require('uuid')
const AWS = require('aws-sdk')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')

const updateTodo = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const { todo } = event.body
  const { id } = event.pathParameters

  await dynamodb.update({
    TableName: 'TodoTable',
    Key: { id },
    UpdateExpression: 'set todo = :todo',
    ExpressionAttributeValues: {
        ':todo': todo 
    },
    ReturnValues: "ALL_NEW"
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
        msg: "Todo is Updated Successfully!"
    })
  }
}

module.exports = {
  handler: middy(updateTodo)
              .use(httpJsonBodyParser())
}
