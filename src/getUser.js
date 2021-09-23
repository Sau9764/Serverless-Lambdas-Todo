const AWS = require('aws-sdk')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const middy = require('@middy/core')

const getUser = async (event) => {

  let options = {
      region: "localhost",
      endpoint: "http://localhost:8000"
    }

  const dynamodb = new AWS.DynamoDB.DocumentClient(options)

  let todos;

  try {
    const results = await dynamodb.scan({ TableName: 'userTable' }).promise()
    todos = results.Items
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

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(todos)
  }
}

module.exports = {
  handler: middy(getUser)
            .use(httpJsonBodyParser())
}
