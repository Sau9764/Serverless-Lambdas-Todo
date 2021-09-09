const { v4 } = require('uuid')
const AWS = require('aws-sdk')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const validator = require('middy-extended-validator');

const updateTodo = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const { todo } = event.body
  const { id } = event.pathParameters

  try {
    await dynamodb.update({
      TableName: 'TodoTable',
      Key: { id },
      UpdateExpression: 'set todo = :todo',
      ExpressionAttributeValues: {
          ':todo': todo 
      },
      ReturnValues: "ALL_NEW"
    }).promise()
  }catch(err) {
    console.log("Error " + err)
     
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({msg: 'Bad Request!'})
    }
    
  }

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

const updateTodoSchema = {
  required: ['todo'],
  properties: {
    todo: { type: 'string' }
  }
}

module.exports = {
  handler: middy(updateTodo)
              .use(httpJsonBodyParser())
              .use(validator({inputSchema: updateTodoSchema, mountSchemaAtBody: true, detailedErrors: true}))
              .use(httpErrorHandler())
}
