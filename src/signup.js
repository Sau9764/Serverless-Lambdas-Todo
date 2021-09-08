const { v4 } = require('uuid')
const AWS = require('aws-sdk')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const middy = require('@middy/core')

const signup = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const { username } = event.body
  const { password } = event.body
  const createdAt = new Date().toISOString()
  const id = v4()

  const newUser = {
    id, 
    username,
    password,
    createdAt
  }

  await dynamodb.put({
    TableName: 'userTable',
    Item: newUser
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({msg: 'User Added Successfully'})
  }
}

module.exports = {
  handler: middy(signup)
            .use(httpJsonBodyParser())
}
