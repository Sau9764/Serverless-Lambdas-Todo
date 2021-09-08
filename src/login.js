const AWS = require('aws-sdk')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const middy = require('@middy/core')
const jwt = require('jsonwebtoken')

const login = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  console.log(event.body)

  const { username } = event.body
  const { password } = event.body

  let users;

  try {
    const results = await dynamodb.scan({ TableName: 'userTable'}).promise()
    users = results.Items
  }catch(err) {
    console.log(err)
  }

  let user = users.find((user) => {
    return user.username === username && user.password === password
  })

  let token = jwt.sign({user: user}, 'secret_msg', {expiresIn: '5m'})

  if(user != undefined){
    console.log('User found')
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
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({msg: 'User Not found'})
    }
  }
  
}

module.exports = {
  handler: middy(login)
            .use(httpJsonBodyParser())
}
