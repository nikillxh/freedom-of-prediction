import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 4000

app.use(cors()) // 💥 Important: allow frontend to call this server

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from the backend!' })
})

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
