const AWS = require('aws-sdk')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')

const deleteTodo = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const { id } = event.pathParameters

  try {
    await dynamodb.delete({ TableName: 'TodoTable', Key: { id } }).promise()
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
    body: JSON.stringify({
        msg: 'Todo Deleted Successfully!'
    })
  }
}

module.exports = {
  handler: middy(deleteTodo)
            .use(httpJsonBodyParser())
            .use(httpErrorHandler())
              
}
