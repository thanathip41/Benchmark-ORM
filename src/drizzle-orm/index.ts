import { db } from './db';

export const drizzleBenchmark = async ( limit : number  ) => {

    const users = await db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
      },
      with: {
        posts: {
          columns: {
            id: true,
            title: true,
            userId: true,
          },
        },
      },
      limit : limit
    })

    return users
}