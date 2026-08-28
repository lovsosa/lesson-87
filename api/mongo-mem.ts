import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import { promises as fs } from 'fs';

const PORT = 27017;
const DB_PATH = path.join(__dirname, '.mongo-data');

const run = async () => {
  await fs.mkdir(DB_PATH, { recursive: true });

  const mongod = await MongoMemoryServer.create({
    instance: {
      port: PORT,
      dbPath: DB_PATH,
      storageEngine: 'wiredTiger',
    },
  });

  console.log('MongoDB ready at ' + mongod.getUri());
  console.log('Data dir: ' + DB_PATH);

  const shutdown = async () => {
    await mongod.stop({ doCleanup: false });
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
