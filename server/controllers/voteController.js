const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const create_vote = async (req, res) => {
  const data = req.body
  try {
    const vote = await prisma.vote.create({
      data,
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
