const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const pool = new Pool({ host: process.env.DB_HOST, database: process.env.DB_NAME,
  user: process.env.DB_USER, password: process.env.DB_PASSWORD, port: 5432,
  ssl: { rejectUnauthorized: false } })

exports.handler = async (event) => {
  const { path, body: rawBody } = event
  const body = JSON.parse(rawBody)
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

  if (path === '/auth/register') {
    const hash = await bcrypt.hash(body.password, 10)
    await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [body.email, hash])
    return { statusCode: 201, headers, body: JSON.stringify({ message: 'User created' }) }
  }

  if (path === '/auth/login') {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [body.email])
    if (!rows.length) return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid credentials' }) }
    const valid = await bcrypt.compare(body.password, rows[0].password_hash)
    if (!valid) return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid credentials' }) }
    const token = jwt.sign({ userId: rows[0].id, email: rows[0].email }, process.env.JWT_SECRET, { expiresIn: '24h' })
    return { statusCode: 200, headers, body: JSON.stringify({ token }) }
  }
}