import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Post } from "./entity/Post"

export const db = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD === '' ? "" : process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User,Post],
    // logging : true,
    migrations: [],
    subscribers: [],
})
