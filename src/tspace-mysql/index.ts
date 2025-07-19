import { DB, Repository } from 'tspace-mysql'
import { User } from './models/User';
import { Post } from './models/Post';

export const tspaceMySqlBenchmark = async (limit : number) => {

    const userRepository = Repository(User);
    
    const users =  await userRepository.findMany({
        relations: { 
            posts: true 
        },
        select : {
            id : true,
            name : true,
            email : true,
            posts: {
                id : true,
                userId : true,
                title: true,
            }
        },
        limit
    });
    
    // const users = await new User()
    // .select('id','name','email')
    // .relations('posts')
    // .relationQuery('posts', q => q.select('id','userId','title'))
    // .limit(limit)
    // .findMany();

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