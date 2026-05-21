const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns')
const { Pool } = require('pg')

const sns = new SNSClient({ region: 'us-east-1' })
const pool = new Pool({ host: process.env.DB_HOST, database: process.env.DB_NAME,
  user: process.env.DB_USER, password: process.env.DB_PASSWORD, port: 5432,
  ssl: { rejectUnauthorized: false } })

exports.handler = async (event) => {
  for (const record of event.Records) {
    const { orderId, userId, items, total } = JSON.parse(record.body)

    // Simulate payment processing
    const paymentSuccess = true  // integrate real payment gateway here

    const newStatus = paymentSuccess ? 'confirmed' : 'failed'

    // Update order status in RDS
    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [newStatus, orderId])

    // Publish to SNS — subscribers will send email + update DynamoDB
    await sns.send(new PublishCommand({
      TopicArn: process.env.ORDER_TOPIC_ARN,
      Message: JSON.stringify({ orderId, userId, total, status: newStatus }),
      Subject: `Order ${newStatus}: #${orderId}`
    }))

    console.log(`Order ${orderId} processed: ${newStatus}`)
  }
}