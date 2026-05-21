const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false }
})

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
  try {
    const { rows } = await pool.query(
      'SELECT id, name, price, description, stock FROM products WHERE active = true'
    )
    return { statusCode: 200, headers, body: JSON.stringify(rows) }
  } catch (err) {
    console.error('DB error:', err)
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) }
  }
}