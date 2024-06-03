import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User';
import { Post } from './models/Post';

export const db = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD === '' ? "" : process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: false,
});

db.addModels([
  User,
  Post
]);