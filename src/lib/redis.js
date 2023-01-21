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

//  Redis Hash to store the titles as keys and their values as 1, and then using the HEXISTS command to check for the existence of a given title in the hash. This would have a O(1) average time complexity for both adding and checking, which is faster than O(n) average time complexity of sismember.

// export const titleExists = async (title) => {
//   return await redis.sismember("project:projectnames", title);
// };

export const titleExists = async (title) => {
  return await redis.hexists("project:titles", title);
}

export default redis
