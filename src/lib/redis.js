import Redis from 'ioredis'

let redis = new Redis(process.env.REDIS_UPSTASH);

export default redis
