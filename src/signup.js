const { v4 } = require('uuid')
const AWS = require('aws-sdk')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const middy = require('@middy/core')
const httpErrorHandler = require('@middy/http-error-handler')
const validator = require('middy-extended-validator');

const signup = async (event) => {

  let options = {
    region: "local-env",
    endpoint: "http://localhost:8000",
    sslEnabled: false
  }

  const dynamodb = new AWS.DynamoDB.DocumentClient(options)

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

  try {
    
    await dynamodb.put({
      TableName: 'userTable',
      Item: newUser
    }).promise()

  }catch(err) {
    console.log('Error' + err)
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
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({msg: 'User Added Successfully'})
  }
}

const signupSchema = {
  required: ['username', 'password'],
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  }
}

module.exports = {
  handler: middy(signup)
            .use(httpJsonBodyParser())
            .use(validator({inputSchema: signupSchema, mountSchemaAtBody: true, detailedErrors: true}))
            .use(httpErrorHandler())
}
