const { Pool } = require('pg')
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs')

const pool = new Pool({ host: process.env.DB_HOST, database: process.env.DB_NAME,
  user: process.env.DB_USER, password: process.env.DB_PASSWORD, port: 5432,
  ssl: { rejectUnauthorized: false } })
const sqs = new SQSClient({ region: 'us-east-1' })

exports.handler = async (event) => {
  const body = JSON.parse(event.body)
  const { userId, items, total } = body
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

  try {
    // 1. Save order to RDS
    const { rows } = await pool.query(
      'INSERT INTO orders (user_id, items, total, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, JSON.stringify(items), total, 'pending']
    )
    const orderId = rows[0].id

    // 2. Push to SQS for async processing
    await sqs.send(new SendMessageCommand({
      QueueUrl: process.env.ORDER_QUEUE_URL,
      MessageBody: JSON.stringify({ orderId, userId, items, total }),
      MessageGroupId: 'orders'   // for FIFO queues
    }))

    return { statusCode: 201, headers, body: JSON.stringify({ orderId, status: 'pending' }) }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Order failed' }) }
  }
}