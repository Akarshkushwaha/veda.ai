import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const connection = new IORedis(process.env.REDIS_URI || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const generationQueue = new Queue('generationQueue', { connection: connection as any });
