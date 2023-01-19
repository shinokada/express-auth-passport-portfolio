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



// console.log('redis-TEST_EVN', config.parsed.TEST_ENV)
// const UPSTASH_REDIS = process.env.UPSTASH_REDIS || config.parsed.UPSTASH_REDIS

// const redis = new Redis(UPSTASH_REDIS);
// UPSTASH end

// For local redis
// const redis = new Redis({
//   host: 'localhost',
//   port: 6379,
// });

export default redis
