# Benchmark ORM
Benchmark ORM using database mysql

library : 6 lib(s)
- mysql2 (pure query)
- sequelize
- typeorm
- prisma
- tspace-mysql
- drizzle

use the database from db/benchmark.zip
- table users data for test 40,000 rows 
- table posts data for test 40,000 rows

The results expect without modify data from function
```js
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

npm test -- --d=20 --l=1000
# @arg {number} --d=20     - benchmark using duration 20 seconds / lib
# @arg {number} --l=1000   - limit 1000 results for benchmark

```

## Images Benchmark
Server: Node 
- Server: native http (no express)
- Server version: 22

Server: mysql via TCP/IP
- Server type: MySQL
- Server version: 8.0.33 - MySQL Community Server - GPL
- Protocol version: 10
- Server charset: UTF-8 Unicode (utf8mb4)

benchmark in 10 seconds with limit 10 rows
![Example Image](images/limit_10.png)

benchmark in 10 seconds with limit 100 rows
![Example Image](images/limit_100.png)

benchmark in 10 seconds with limit 500 rows
![Example Image](images/limit_500.png)

benchmark in 10 seconds with limit 1000 rows
![Example Image](images/limit_1000.png)

benchmark in 10 seconds with limit 5000 rows
![Example Image](images/limit_5000.png)

benchmark in 10 seconds with limit 10000 rows
![Example Image](images/limit_10000.png)

benchmark in 10 seconds with limit 20000 rows
![Example Image](images/limit_20000.png)

benchmark in 10 seconds with limit 30000 rows
![Example Image](images/limit_30000.png)