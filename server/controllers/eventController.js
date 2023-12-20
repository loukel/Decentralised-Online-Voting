const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const create_event = async (req, res) => {
  const data = req.body
  try {
    const options = data?.options
    delete data.options
    const event = await prisma.event.create({
      data: {
        ...data,
        options: {
          create: options,
        },
      },
      include: {
        options: true,
      },
    })

    res.status(201).send(event)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

const get_events = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        options: {
          include: {
            votes: true,
          },
        },
      },
    })

    res.status(200).send(events)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = {
  create_event,
  get_events,
}
