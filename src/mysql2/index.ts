import { db } from "./db"

export const mysql2Benchmark = async (limit : number) => {

    const sql = "SELECT `users`.`id`, `users`.`name`, `users`.`email`, CASE WHEN COUNT(`posts`.`id`) = 0 THEN JSON_ARRAY() ELSE JSON_ARRAYAGG( JSON_OBJECT('id' , `posts`.`id` , 'userId' , `posts`.`userId` , 'email' , `posts`.`title`) ) END AS `posts` FROM `users` LEFT JOIN `posts` ON `users`.`id` = `posts`.`userId` WHERE `users`.`deletedAt` IS NULL GROUP BY `users`.`id` LIMIT ?"
   
    const [users] = await db.query(sql,[limit])
    
    return users
}