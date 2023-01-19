import Redis from 'ioredis'
// UPSTASH start
import dotenv from 'dotenv';
import { redis_host, redis_port } from '../config/redisconfig.js';

const config = dotenv.config();

const UPSTASH_REDIS = process.env.UPSTASH_REDIS || config.parsed.UPSTASH_REDIS

// const redis = new Redis(UPSTASH_REDIS);
// UPSTASH end

// For local redis
const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

export default redis
