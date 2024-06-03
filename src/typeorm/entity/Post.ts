import { Entity, PrimaryGeneratedColumn, Column , ManyToOne } from "typeorm"
import { User } from "./User"

@Entity({ name: "posts" })
export class Post {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "uuid" })
    uuid!: string

    @Column()
    userId!: number

    @Column()
    title!: string

    @Column({ type: 'timestamp' })
    createdAt !: Date

    @Column({ type: 'timestamp' })
    updatedAt  !: Date

    @Column({ type: 'timestamp' })
    deletedAt  !: Date

    @ManyToOne(() => User, user => user.posts)
    user!: User
}
