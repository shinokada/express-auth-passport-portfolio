import Redis from 'ioredis'
import dotenv from 'dotenv';
import { redis_host, redis_port } from '../config/redisconfig.js';

let redis;

if (process.env.NODE_ENV === 'production') {
  dotenv.config();
  const UPSTASH_REDIS = process.env.UPSTASH_REDIS
  redis = new Redis(UPSTASH_REDIS);
} else {
  redis = new Redis({
    host: redis_host,
    port: redis_port,
  });
}

export default redis