const { PrismaClient } = require('@prisma')
const prisma = new PrismaClient()

const create_event = async (req, res) => {
  const data = req.body
  try {
    const event = await prisma.event.create({
      data,
    })

    res.status(201).send(event)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

const get_event = async (req, res) => {
  const id = req.params.id

  try {
    const event = await prisma.event.findFirst({
      where: {
        id,
      },
      include: {
        options: {
          include: {
            votes: true,
          },
        },
      },
    })

    res.status(204).send(event)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = {
  create_event,
  get_event,
}
