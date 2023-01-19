import Redis from 'ioredis'
import dotenv from 'dotenv';
import { redis_host, redis_port } from '../config/redisconfig.js';

let redis;

dotenv.config();

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  redis = new Redis(process.env.UPSTASH_REDIS);
} else if (process.env.NODE_ENV === 'localdevelopment') {
  redis = new Redis({ host: redis_host, port: redis_port });
}

export default redis
