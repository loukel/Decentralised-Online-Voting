const express = require('express')
const dotenv = require('dotenv')

// Set up environment variables 📝
dotenv.config()

// Init app
const app = express()
// app.use(routes)
app.use(express.static('public'))

app.get('/', (req, res) => res.render('index'))
app.get('/results', (req, res) => res.render('results'))

// Set up port
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Web server listening on ${PORT}`)
})
