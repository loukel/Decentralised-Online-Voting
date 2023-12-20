const { PrismaClient } = require('@prisma')
const prisma = new PrismaClient()

const create_option = async (req, res) => {
  const data = req.body
  try {
    const option = await prisma.eventOption.create({
      data,
    })

    res.status(201).send(option)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

const get_option = async (req, res) => {
  const id = req.params.id

  try {
    const option = await prisma.eventOption.findFirst({
      where: {
        id,
      },
      include: {
        votes: true,
      },
    })

    res.status(204).send(option)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = {
  create_option,
  get_option,
}
