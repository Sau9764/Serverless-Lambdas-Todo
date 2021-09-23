const { v4 } = require('uuid')
const AWS = require('aws-sdk')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const validator = require('middy-extended-validator');

const addTodo = async (event) => {

  let options = {
    region: "local-env",
    endpoint: "http://localhost:8000",
    sslEnabled: false
  }

  const dynamodb = new AWS.DynamoDB.DocumentClient(options)

  const { todo } = event.body
  const createdAt = new Date().toISOString()
  const id = v4()

  const newTodo = {
    id, 
    todo,
    createdAt
  }

  try {
    
    await dynamodb.put({
      TableName: 'TodoTable',
      Item: newTodo
    }).promise()

  }catch(err){
    
    console.log('Error ' + err)
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
    body: JSON.stringify({msg: 'Todo Created Successfully!'})
  }
}

const addTodoSchema = {
  required: ['todo'],
  properties: {
    todo: { type: 'string' }
  }
}

module.exports = {
  handler: middy(addTodo)
            .use(httpJsonBodyParser())
            .use(validator({inputSchema: addTodoSchema, mountSchemaAtBody: true, detailedErrors: true}))
            .use(httpErrorHandler())
}
