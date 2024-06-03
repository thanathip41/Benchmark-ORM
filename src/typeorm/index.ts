import { db } from "./db";
import { User } from "./entity/User";

export const typeormBenchmark = async ( limit : number  ) => {

    const userRepository = db.getRepository(User);
          
    const users = await userRepository.find({
        select : {
            id: true,
            name: true,
            email: true,
            posts : {
                id: true,
                title: true,
                userId: true,
            }
        },
        relations: ["posts"],
        take : limit
    });

    return users
}

