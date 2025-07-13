import http from 'http';
import url from 'url';
import { tspaceMySqlBenchmark } from './tspace-mysql';
import { prismaBenchmark } from './prisma';
import { typeormBenchmark } from './typeorm';
import { drizzleBenchmark } from './drizzle-orm';
import { mysql2Benchmark } from './mysql2';
import { sequelizeBenchmark } from './sequelize';

import { db as typeorm } from './typeorm/db';
import { db as sequelize } from './sequelize/db';

const PORT = 3000;
const RETURN_VOID = true;

const normalizeLimit = (limit: unknown) => Number(limit ?? 1000);

const routes: Record<string, (limit: number) => Promise<any>> = {
  '/mysql2': mysql2Benchmark,
  '/sequelize': sequelizeBenchmark,
  '/tspace-mysql': tspaceMySqlBenchmark,
  '/prisma': prismaBenchmark,
  '/typeorm': typeormBenchmark,
  '/drizzle-orm': drizzleBenchmark,
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url || '', true);
  const path = parsedUrl.pathname || '';
  const method = req.method;

  if (method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Method Not Allowed' }));
  }

  const handler = routes[path];
  if (handler) {
    try {
      const limit = normalizeLimit(parsedUrl.query.limit);
      const users = await handler(limit);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(RETURN_VOID ? { success: true } : { users }));
    } catch (err: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: err.message || 'Internal Server Error' }));
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not found' }));
});

(async () => {
  try {
    await typeorm.initialize();
    await sequelize.sync();
  } catch (err) {
    console.error('DB Init Error:', err);
  }

  server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
})();
