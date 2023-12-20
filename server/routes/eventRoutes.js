const express = require('express')
const router = express.Router()

const eventController = require('../controllers/eventController')

router.get('/', eventController.get_events)
router.post('/', eventController.create_event)

module.exports = router
