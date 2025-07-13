import { db } from "./db";
import { Post } from "./entity/Post";
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

export const typeormTransction = async () => {
    const queryRunner = db.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const user = queryRunner.manager.create(User, {
        uuid : '11',
        name: 'John Doe',
        username : 'usernameJohn',
        email: 'john@example.com',
    });
    await queryRunner.manager.save(user);

    const post = queryRunner.manager.create(Post, {
        uuid : '11',
        title : '12212',
        userId: user.id,
    });
    await queryRunner.manager.save(post);

    // await queryRunner.commitTransaction();

    return { user , post }
  } catch (err) {
    await queryRunner.rollbackTransaction();
  } finally {
    // await queryRunner.release();
  }
}