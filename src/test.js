const { v4 } = require('uuid')
const AWS = require('aws-sdk')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')

const test = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const { todo } = event.body
  const createdAt = new Date().toISOString()
  const id = v4()

  const newTodo = {
    id, 
    todo,
    createdAt,
    completed: false
  }

  await dynamodb.put({
    TableName: 'TodoTable',
    Item: newTodo
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({msg: 'Data Added Successfully!'})
  }
}

  // const input = {
  //   required: ['todo'],
  //   properties: {
  //     todo: {
  //       type: 'string'
  //     }
  //   }
  // }

const input = {
  type: 'object',
  properties: {
    todo: { type: 'string'}
  },
  required: ['todo']
}

const inputSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        todo: { type: 'string' }
      },
      required: ['todo'] // Insert here all required event properties
    }
  }
 }

module.exports = {
  handler: middy(test)
            .use(httpJsonBodyParser())
            // .use(validator({inputSchema: inputSchema}))
            .use(httpErrorHandler())
  }
