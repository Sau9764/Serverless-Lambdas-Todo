const { v4 } = require('uuid')
const AWS = require('aws-sdk')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')

const addTodo = async (event) => {

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
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({msg: 'Todo Created Successfully!'})
  }
}

module.exports = {
  handler: middy(addTodo).use(httpJsonBodyParser())
}
