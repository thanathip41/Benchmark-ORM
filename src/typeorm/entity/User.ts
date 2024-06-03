import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Timestamp, OneToMany } from "typeorm"
import { Post } from "./Post"

@Entity({ name: "users" })
export class User {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "uuid" })
    uuid!: string

    @Column()
    name!: string

    @Column()
    username!: string

    @Column()
    email!: string

    @Column({ type: 'timestamp' })
    createdAt !: Date

    @Column({ type: 'timestamp' })
    updatedAt  !: Date

    @Column({ type: 'timestamp' })
    deletedAt  !: Date

    @OneToMany(() => Post, post => post.user)
    posts!: Post[]
}
