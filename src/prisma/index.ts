import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const prismaBenchmark = async ( limit : number ) => {

  const users =  await prisma.user.findMany({
    select : {
      id : true,
      name : true,
      email : true,
      posts: {
        select: {
          id : true,
          userId : true,
          title: true,
        }
      }
    },
    take: limit
  })

  return users
}