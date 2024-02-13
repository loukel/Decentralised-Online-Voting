const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const CryptoJS = require('crypto-js')

const hashIdentity = (plaintext, secretKey) => {
  return CryptoJS.HmacSHA256(plaintext, secretKey).toString()
}

const create_vote = async (req, res) => {
  const data = req.body
  try {
    // Check user hasn't voted already -> in future to ensure it isn't store whether a user has voted already -> use digital signaturess
    // Make it so user provides public key, then store the public key -> user's identity is public key (secret key), identity is stored in another table?

    // Hash user identity
    // const hashedUserId = hashIdentity(data.userId, data.secretKey)

    // Check user has correct password
    const user = await prisma.user.findFirst({
      where: {
        username: data.userId,
      },
    })

    if (user.password != data.secretKey) {
      return res.sendStatus(403)
    }

    const option = await prisma.eventOption.findFirst({
      where: {
        id: data.optionId,
      },
    })

    const vote = await prisma.vote.create({
      data: {
        username: user.username,
        optionId: data.optionId,
        eventId: option.eventId,
      },
    })

    res.status(201).send(vote)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

const get_vote = async (req, res) => {
  const id = req.params.id

  try {
    const vote = await prisma.vote.findFirst({
      where: {
        id,
      },
      include: {
        votes: true,
      },
    })

    res.status(204).send(vote)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = {
  create_vote,
  get_vote,
}
