const express = require('express')
const router = express.Router()

const optionController = require('../controllers/optionController')

router.post('/', optionController.create_option)
router.get('/:id', optionController.get_option)

module.exports = router
