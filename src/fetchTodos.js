const AWS = require('aws-sdk')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const middy = require('@middy/core')

const fetchTodos = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  let todos;

  try {
    const results = await dynamodb.scan({ TableName: 'TodoTable' }).promise()
    todos = results.Items
  }catch(err) {
    console.log(err)
  }

  console.log(todos)

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
  handler: middy(fetchTodos)
            .use(httpJsonBodyParser())
}
