const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

// https://stackoverflow.com/questions/77435838/hash-password-in-prisma-orm
const saltRounds = 10

const main = async () => {
  for (let index = 1; index <= 10; index++) {
    const password = await bcrypt.hash(`password${index}`, saltRounds)

    await prisma.user.create({
      data: {
        username: `${index}`,
        password,
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('\x1b[32m%s\x1b[0m', 'Successfully Seeded!')
  })
