const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const main = async () => {
  for (let index = 1; index <= 10; index++) {
    await prisma.user.create({
      data: {
        username: `${index}`,
        password: 'password' + index,
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
