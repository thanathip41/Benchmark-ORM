import { Blueprint, Model , TSchema , TRelation }  from 'tspace-mysql'
import { Post  } from './Post'

const schema = { 
    id : new Blueprint().bigInt(10).primary().autoIncrement(),
    uuid :new Blueprint().varchar(50).null(),
    name :new Blueprint().longText().null(),
    username : new Blueprint().varchar(255).null(),
    email :new Blueprint().longtext().null(),
    createdAt :new Blueprint().timestamp().null(),
    updatedAt :new Blueprint().timestamp().null(),
    deletedAt :new Blueprint().timestamp().null(),
}

type TS = TSchema<typeof schema> 

type TR = TRelation<{
    posts : Post[]
}>

class User extends Model<TS,TR> {
    constructor() {
        super()
        this.useCamelCase()
        this.useUUID()
        this.useTimestamp()
        this.hasMany({ model : Post , name : 'posts'  })
        this.useSchema(schema)
    }
}

export { User }