import express from 'express'
import Debug from 'debug'
import pkg from 'mongodb';
const { MongoClient } = pkg;
// you need to add assert { type: "json" } to import JSON in ES modules
// import articles from '../data/mydata.json' assert { type: "json" }
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const debug = Debug('app:adminRouter')
const articlesRouter = express.Router()
const username = process.env.USERNAME
const password = process.env.PASSWORD
const cluster = process.env.CLUSTERNAME

articlesRouter.route('/').get(async (req, res) => {
  // res.render('articles', {
  //   articles,
  // })
  const dbName = 'demo1'
  const url = `mongodb+srv://${username}:${password}@${cluster}.sabpl.mongodb.net/?retryWrites=true&w=majority`

  debug('Connecting DB ...')
  const client = await MongoClient.connect(url)
  const db = client.db(dbName)
  const collection = db.collection('articles')

  try {
    const articles = await collection.find().toArray()
    res.render('articles', { articles })
  } catch (error) {
    debug('error', error)
  } finally {
    client.close()
  }
})
// articles/any-id
articlesRouter.route('/:id').get((req, res) => {
  const id = req.params.id
  res.render('article', {
    article: articles[id]
  }
  )
})

export { articlesRouter }