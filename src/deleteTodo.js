const AWS = require('aws-sdk')

const deleteTodo = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const { id } = event.pathParameters

  try {
    await dynamodb.delete({ TableName: 'TodoTable', Key: { id } }).promise()
  }catch(err) {
    console.log(err)
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
        msg: 'Todo Deleted Successfully!'
    })
  }
}

module.exports = {
  handler: deleteTodo
}
