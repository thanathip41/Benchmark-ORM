import { Repository , TRepository } from 'tspace-mysql'
import { User } from './models/User';

export const tspaceMySqlBenchmark = async (limit : number = 30_000) => {

    const userRepository = Repository.bind(User);
          
    const users = await userRepository.findMany({
        select : ['id','name','email'],
        relations: ['posts'],
        relationQuery : {
            name : 'posts',
            callback: () => ({
                select : ['id','userId','title']
            })
        },
        limit : limit
    })

    return users
}