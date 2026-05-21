const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb')

const dynamo = new DynamoDBClient({ region: 'us-east-1' })

exports.handler = async (event) => {
  for (const record of event.Records) {
    const { orderId, userId, total, status } = JSON.parse(record.Sns.Message)

    // Write order status to DynamoDB (fast lookup for frontend)
    await dynamo.send(new PutItemCommand({
      TableName: process.env.ORDER_TABLE,
      Item: {
        orderId:   { S: String(orderId) },
        userId:    { S: String(userId) },
        total:     { N: String(total) },
        status:    { S: status },
        updatedAt: { S: new Date().toISOString() }
      }
    }))

    console.log(`Order ${orderId} status saved to DynamoDB: ${status}`)
  }
}