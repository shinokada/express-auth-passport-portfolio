import express from 'express'
import Debug from 'debug'
import Redis from "ioredis"

let redis = new Redis(process.env.REDIS_UPSTASH);

const debug = Debug('app:adminRouter')
const articlesRouter = express.Router()

articlesRouter.route('/').get(async (req, res) => {
  debug('in article route')
  try {
    // const articles = await collection.find().toArray()
    const articles = await redis.hgetall('articles');
    if (articles) {
      debug('articles: ', articles)
      // res.send('hi 1')
      res.render('articles', { articles })
    }
  } catch (error) {
    debug('error', error)
  }
})
// articles/any-id
articlesRouter.route('/:id').get(async (req, res) => {
  const id = req.params.id
  // res.render('article', {
  //   article: articles[id]
  // })
  // const dbName = 'demo1'
  // const url = `mongodb+srv://${username}:${password}@${cluster}.sabpl.mongodb.net/?retryWrites=true&w=majority`

  // const client = await MongoClient.connect(url)
  // const db = client.db(dbName)
  // const collection = db.collection('articles')

  try {
    // const article = await collection.findOne({ _id: new ObjectID(id) })
    debug('Connecting DB ...')
    let articles = await redis.hget('articles', id);
    res.render('article', { article })
  } catch (error) {
    debug('error', error)
  }
})

export { articlesRouter }