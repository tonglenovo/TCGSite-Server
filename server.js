const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const matchRoutes = require('./routes/matchRoutes')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/matches', matchRoutes)

// Test route
app.get('/', (req, res) => {
  res.send('TongYT API is running')
})

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')

    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000')
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })