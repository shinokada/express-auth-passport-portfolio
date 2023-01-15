import express from 'express'
import Debug from 'debug'
import { v4 as uuidv4 } from 'uuid'
import Redis from "ioredis"

let redis = new Redis(process.env.REDIS_UPSTASH);

const debug = Debug('app:adminRouter')
const adminRouter = express.Router()

adminRouter.route('/').get((req, res) => {
  const title = "Admin"
  res.render('admin', { title })
})



export { adminRouter }