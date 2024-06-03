import { Post } from "./models/Post";
import { User } from "./models/User";

export const sequelizeBenchmark = async ( limit : number) => {

    const users = await User.findAll({
        attributes: ['id', 'name', 'email'],
        include: [
            {
              model: Post,
              attributes: ['id', 'title','userId']
            }
        ],
        limit : limit
    });

    return users
}

