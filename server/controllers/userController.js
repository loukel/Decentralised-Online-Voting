const { PrismaClient } = require('@prisma')
const prisma = new PrismaClient()

const create_user = async (req, res) => {
  const data = req.body
  try {
    const user = await prisma.user.create({
      data,
    })

    res.status(201).send(user)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = {
  create_user,
}
