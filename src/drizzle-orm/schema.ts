import { relations } from 'drizzle-orm';
import { mysqlTable, int, varchar, datetime, serial, unique , timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial("id").primaryKey(),
  uuid : varchar('name' , { length: 255 }).notNull(),
  name: varchar('name' , { length: 255 }).notNull(),
  username: varchar('name' , { length: 255 }).notNull(),
  email: varchar('email' , { length: 255 }).notNull().unique(),
  createdAt : timestamp('createdAt'),
  updatedAt : timestamp('updatedAt'),
  deletedAt : timestamp('deletedAt'),
});
export const posts = mysqlTable('posts', {
  id: serial("id").primaryKey(),
  uuid : varchar('name' , { length: 255 }),
  title: varchar('title' , { length: 255 }).notNull(),
  userId: int('userId').notNull(),
  createdAt : timestamp('createdAt'),
  updatedAt : timestamp('updatedAt'),
  deletedAt : timestamp('deletedAt'),
});

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
}));
  
export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
}));