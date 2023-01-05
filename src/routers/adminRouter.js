import express from 'express'
import Debug from 'debug'
import { v4 as uuidv4 } from 'uuid'
import Redis from "ioredis"
// import { Redis } from '@upstash/redis'

let redis = new Redis("redis://default:c92b3c34cd054cb09e99ef27d52d3d8c@apn1-apt-jennet-33538.upstash.io:33538");

const debug = Debug('app:adminRouter')
const adminRouter = express.Router()

// const url = process.env.UPSTASH_REDIS_REST_URL
// const token = process.env.UPSTASH_REDIS_REST_TOKEN
// console.log('url: ', url)

adminRouter.route('/').get(async (req, res) => {
  res.render('admin')
  // const member = await redis.srandmember("express")
  // debug('random member: ', member)
})

adminRouter.route('/create').post(async (req, res) => {

  let { title, description, content } = req.body

  if (!title) {
    res.status(400).json({
      error: 'Title can not be empty',
    })
  } else if (title.length < 150) {
    const id = uuidv4()
    title = title.replace(/\s+/g, '-').toLowerCase();
    const newEntry = {
      id,
      title,
      created_at: Date.now(),
      description,
      content
    }
    // await redis.hset(JSON.stringify(newEntry))
    await redis.hset('articles', title, JSON.stringify(newEntry))
    // await redis.set('key', 'value');
    let articles = await redis.hgetall('articles');

    res.render('articles', { articles })
  } else {
    res.status(400).json({
      error: 'Max 150 characters please.',
    })
  }
})
export { adminRouter }