const express = require('express')
const app = express()
const PORT = process.env.PORT || 80

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'shopcloud-admin' })
})

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="font-family:sans-serif;padding:40px;background:#f9fafb">
        <h1>ShopCloud Admin</h1>
        <p>Admin dashboard running on ECS Fargate</p>
        <ul>
          <li>DB Host: ${process.env.DB_HOST || 'not set'}</li>
          <li>Region: us-east-1</li>
        </ul>
      </body>
    </html>
  `)
})

app.listen(PORT, () => console.log(`Admin running on port ${PORT}`))
