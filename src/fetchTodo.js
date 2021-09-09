const AWS = require('aws-sdk')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')

const fetchTodo = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const { id } = event.pathParameters

  let todo;

  try {
    const result = await dynamodb.get({ TableName: 'TodoTable', Key: { id } }).promise()
    todo = result.Item 
  }catch(err) {
    console.log(err)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(todo)
  }
}

module.exports = {
  handler: middy(fetchTodo)
            .use(httpJsonBodyParser())
            .use(httpErrorHandler())
}
