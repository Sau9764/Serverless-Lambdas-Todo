const { v4 } = require('uuid')
const AWS = require('aws-sdk')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
// const validator = require('@middy/validator')
const validator = require('middy-extended-validator');


const test = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  console.log('this is event body')
  console.log(event)

  const { todo } = event.body
  const createdAt = new Date().toISOString()
  const id = v4()

  const newTodo = {
    id, 
    todo,
    createdAt
  }

  await dynamodb.put({
    TableName: 'TodoTable',
    Item: newTodo
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({msg: 'Data Added Successfully!'})
  }
}

const input = {
  type: 'object',
  required: ['todo'],
  properties: {
    todo: {
      type: 'string'
    }
  }
}

module.exports = {
  handler: middy(test)
            .use(httpJsonBodyParser())
            .use(validator({inputSchema: input, mountSchemaAtBody: true, detailedErrors: true}))
            .use(httpErrorHandler())
  }
