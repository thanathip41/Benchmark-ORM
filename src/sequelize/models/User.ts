import { Model, Column, Table, DeletedAt, DataType, PrimaryKey, HasMany } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Post } from './Post';

@Table({ tableName: 'users', modelName: 'User', timestamps: true, paranoid: true })
class User extends Model {
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
    uuid !: string;

  @Column({
    allowNull: false,
    unique: true,
  })
  email !: string;

  @Column({
    allowNull: false,
  })
  name !: string;

  @Column({
    allowNull: false,
    unique: true,
  })
  username !: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  createdAt !: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  updatedAt !: Date;

  @DeletedAt
  deletedAt !: Date;

  @HasMany(() => Post)
  posts !: Post[];

}

export { User}
export default User;
