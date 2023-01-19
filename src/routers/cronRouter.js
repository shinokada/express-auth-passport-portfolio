import express from 'express'
import Debug from 'debug'
import redis from '../lib/redis.js'
import { addUsCities } from '../data/uscities.js'
import { addIntCities } from '../data/worldcities.js'

const debug = Debug('app:feedRouter')
const cronRouter = express.Router()

cronRouter.route('/').get((req, res) => {
  res.send('Ok')
})

cronRouter.route('/feed').get((req, res) => {
  redis.flushall();
  addUsCities();
  addIntCities();
  const title = "Feed router"
  res.send('Flushed all data and inserted fresh data including uscities and world cities.')
})

export { cronRouter }