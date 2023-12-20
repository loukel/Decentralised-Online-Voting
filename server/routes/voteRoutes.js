const express = require('express')
const router = express.Router()

const voteController = require('../controllers/voteController')

router.post('/', voteController.create_vote)
router.get('/:id', voteController.get_vote)

module.exports = router
