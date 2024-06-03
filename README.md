# Benchmark ORM
Benchmark ORM using database mysql

library  : 6 lib(s)
- mysql2 (pure query)
- sequelize
- typeorm
- prisma
- tspace-mysql
- drizzle

use the database from db/benchmark.sql
- table users data for test 40,000 rows 
- table posts data for test 40,000 rows

```js
The data expect
{
    "users": [
        {
            "id": 'number',
            "name": 'string',
            "email": 'string',
            "posts": [
                "id": 'number',
                "userId": 'number',
                "title": 'string',
            ]
        }
        // ....
    ]
}

```

```sh
npm install
npx prisma generate
npm start

npm test -- --d=5 --w=2 --r=3 --l=1000
# @arg {number} --d=5      - benchmark using duration 5 seconds / lib
# @arg {number} --w=2      - waiting after benchmark  2 seconds/ lib
# @arg {number} --r=3      - repeat the benchmark for 3 count
# @arg {number} --l=1000   - limit 1000 results for benchmark

```