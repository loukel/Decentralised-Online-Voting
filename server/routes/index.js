const express = require('express')
const router = express.Router()

const userRoutes = require('./userRoutes')
const eventRoutes = require('./eventRoutes')
const voteRoutes = require('./voteRoutes')
const optionRoutes = require('./optionRoutes')

router.use('/users', userRoutes)
router.use('/events', eventRoutes)
router.use('/votes', voteRoutes)
router.use('/options', optionRoutes)

router.use((req, res) => {
  res.sendStatus(404)
})

module.exports = router
