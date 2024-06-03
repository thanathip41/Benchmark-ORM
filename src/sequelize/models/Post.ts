import { Model, Column, DataType, Table, ForeignKey, BelongsTo, PrimaryKey } from 'sequelize-typescript';
import { User } from './User';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'posts', modelName: 'Post', timestamps: true, paranoid: true })
class Post extends Model<Post> {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id !: number;

  @Column({
    defaultValue: () => uuidv4(),
    allowNull: false,
    type: DataType.UUID,
  })
  uuid!: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  userId!: number;

  @Column({
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: null,
    allowNull: true,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: null,
    allowNull: true,
  })
  updatedAt!: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: null,
    allowNull: true,
  })
  deletedAt!: Date;

  @BelongsTo(() => User, 'userId')
  user!: User;
}

export { Post }
export default Post