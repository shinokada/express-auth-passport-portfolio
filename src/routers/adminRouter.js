import express from 'express'
import Debug from 'debug'
import Upstash from 'upstash';
import * as dotenv from 'dotenv'
dotenv.config()

const debug = Debug('app:adminRouter')
const adminRouter = express.Router()

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

const upstash = new Redis({
  url,
  token,
});

adminRouter.route('/').get(async (req, res) => {
  try {
    const response = await upstash.putObject({
      Bucket: bucketName,
      Key: 'mydata.json',
      Body: articles,
    });
    debug("Data inserted")
    res.json(response)
  } catch (error) {
    debug('error', error)
  }
})

export { adminRouter }