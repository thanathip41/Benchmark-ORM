import { DB, Repository } from 'tspace-mysql'
import { User } from './models/User';
import { Post } from './models/Post';

export const tspaceMySqlBenchmark = async (limit : number = 30_000) => {

    // const users =  await Repository(User).findMany({
    //     select : {
    //         id : true,
    //         name : true,
    //         email : true,
    //         posts: {
    //             id : true,
    //             userId : true,
    //             title: true,
    //         }
    //     },
    //     limit
    // });
    
    const users = await new User()
    .select('id','name','email')
    .relations('posts')
    .relationQuery('posts', q => q.select('id','userId','title'))
    .limit(limit)
    .get();

    return users;
}

export const tspaceMySqlTransction = async () => {
    
  const connection = await new DB().beginTransaction();

    try {
   
    await connection.startTransaction();

    const user = await new User()
        .create({
        name: `tspace`,
        email: "tspace@example.com",
        })
        .bind(connection)
        .save() as any

    const post = await new Post()
    .create( {
        userId: user.id,
        title: `tspace-post1`,
    },)
    .bind(connection) // don't forget this
    .save();

    await connection.commit();

    return {
        user,
        post
    }
    
    } catch (err) {
    /**
     *
     * @rollback rollback transaction
     */

    console.log(err)
    await connection.rollback();

    throw err
    }
}