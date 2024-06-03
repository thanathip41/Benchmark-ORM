import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import 'dotenv/config'

import { tspaceMySqlBenchmark } from './tspace-mysql';
import { prismaBenchmark } from './prisma';
import { typeormBenchmark } from './typeorm';
import { drizzleBenchmark } from './drizzle-orm';
import { mysql2Benchmark } from './mysql2';
import { sequelizeBenchmark } from './sequelize';

import { db as typeorm } from './typeorm/db';
import { db as sequelize } from './sequelize/db';

const normalizeLimit = (limit : unknown) => {
  return Number(limit ?? 1_000)
}

const app = express()

const PORT = 3000

const RETURN_VOID = true

// app.use(morgan('dev'))


app.get('/mysql2', async (req : Request , res : Response , next : NextFunction) => {
  try {

    const users = await mysql2Benchmark(normalizeLimit(req.query?.limit))
    if(RETURN_VOID) return res.json({ success : true });
    return res.json({ users });

  } catch (err) {
    return next(err)
  }
})

app.get('/sequelize', async (req : Request , res : Response , next : NextFunction) => {
  try {

    const users = await sequelizeBenchmark(normalizeLimit(req.query?.limit))
    if(RETURN_VOID) return res.json({ success : true });
    return res.json({ users });

  } catch (err) {
    return next(err)
  }
})

app.get('/tspace-mysql', async (req : Request , res : Response , next : NextFunction) => {
  try {

    const users = await tspaceMySqlBenchmark(normalizeLimit(req.query?.limit))
    if(RETURN_VOID) return res.json({ success : true });
    return res.json({ users });

  } catch (err) {
    return next(err)
  }
})

app.get('/prisma', async (req : Request , res : Response, next : NextFunction) => {
  try {

    const users = await prismaBenchmark(normalizeLimit(req.query?.limit))
    if(RETURN_VOID) return res.json({ success : true });
    return res.json({ users });

  } catch (err) {
    return next(err)
  }
})

app.get('/typeorm', async (req : Request , res : Response, next : NextFunction) => {
  try {

    const users = await typeormBenchmark(normalizeLimit(req.query?.limit))
    if(RETURN_VOID) return res.json({ success : true });
    return res.json({ users });

  } catch (err) {
    return next(err);
  }
})

app.get('/drizzle-orm', async (req : Request , res : Response, next : NextFunction) => {
  try {

    const users = await drizzleBenchmark(normalizeLimit(req.query?.limit))
    if(RETURN_VOID) return res.json({ success : true });
    return res.json({ users });

  } catch (err) {
    return next(err);
  }
})

app.use((err : any , req : Request , res : Response , next : NextFunction) => {
  return res.status(500).json({
    message : err.message
  })
})

app.use('*', async (req : Request , res : Response, next : NextFunction) => {
  return res.status(404).json({ message : 'Not found' });
})

app.listen(PORT, async () => {
  await typeorm.initialize().catch(err => console.log(err))
  await sequelize.sync().catch(err => console.log(err))
  console.log(`Server is listening on port : 'http://localhost:${PORT}'`);
})