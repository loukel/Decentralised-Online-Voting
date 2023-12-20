const express = require('express')
const router = express.Router()

const eventController = require('../controllers/eventController')

router.post('/', eventController.create_event)
router.get('/:id', eventController.get_event)

module.exports = router
