import express from 'express'
import Debug from 'debug'
import { v4 as uuidv4 } from 'uuid'
import Redis from "ioredis"

let redis = new Redis(process.env.REDIS_UPSTASH);

const debug = Debug('app:adminRouter')
const adminRouter = express.Router()

adminRouter.route('/').get(async (req, res) => {
  res.render('admin')
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
    await redis.hset('articles', title, JSON.stringify(newEntry))
    let articles = await redis.hgetall('articles');

    res.render('articles', { articles })
  } else {
    res.status(400).json({
      error: 'Max 150 characters please.',
    })
  }
})
export { adminRouter }