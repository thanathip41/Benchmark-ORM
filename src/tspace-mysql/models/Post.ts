import { Blueprint, Model , TSchema , RelationType, TSchemaModel, BelongsTo, TRelation }  from 'tspace-mysql'
import { User } from './User'

const schema = { 
  id          : new Blueprint().int().notNull().primary().autoIncrement(),
  uuid        : new Blueprint().varchar(50).null(),
  userId      : new Blueprint().int().notNull().foreign({ on : User , onDelete : 'CASCADE' , onUpdate : 'CASCADE' }),
  title       : new Blueprint().varchar(255).null(),
  createdAt   : new Blueprint().timestamp().null(),
  updatedAt   : new Blueprint().timestamp().null(),
  deletedAt   : new Blueprint().timestamp().null()
}

type TS = TSchema<typeof schema>

type TR =  TRelation<{
  user : User
}>

class Post extends Model<TS , TR> {
  constructor() {
    super()
    this.useUUID()
    this.useTimestamp()
    this.useSoftDelete()
    this.useCamelCase()
    this.belongsTo({ name : 'user' , model : User })
    this.useSchema(schema)

  }
}
export { Post }
