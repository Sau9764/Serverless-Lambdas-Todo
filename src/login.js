const AWS = require('aws-sdk')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const middy = require('@middy/core')
const httpErrorHandler = require('@middy/http-error-handler')
const jwt = require('jsonwebtoken')
const validator = require('middy-extended-validator');

const login = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const { username } = event.body
  const { password } = event.body

  let users;

  try {
    const results = await dynamodb.scan({ TableName: 'userTable'}).promise()
    users = results.Items
  }catch(err) {
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

  let user = users.find((user) => {
    return user.username === username && user.password === password
  })
  if(user){
    console.log('User found')
    let token = jwt.sign({user: user}, 'secret_msg', {expiresIn: '5m'})
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({id_token: token})
    }
  }else{
    console.log('User Not found')
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({msg: 'User Not found'})
    }
  }
}

const loginSchema = {
  required: ['username', 'password'],
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  }
}

module.exports = {
  handler: middy(login)
            .use(httpJsonBodyParser())
            .use(validator({inputSchema: loginSchema, mountSchemaAtBody: true, detailedErrors: true}))
            .use(httpErrorHandler())
}
