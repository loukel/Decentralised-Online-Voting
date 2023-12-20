const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const routes = require('./routes/index')

// Set up environment variables 📝
dotenv.config()

// Init app
const app = express()

app.use(express.json())

app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: 'GET, POST',
  })
)
app.use(morgan('dev'))
app.use(routes)

// Set up port
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Web server listening on ${PORT}`)
})
