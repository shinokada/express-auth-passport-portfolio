import express from 'express'
import Debug from 'debug'
import { default as mongodb } from 'mongodb';
let MongoClient = mongodb.MongoClient;
import mongoose from 'mongoose'
// you need to add assert { type: "json" } to import JSON in ES modules
import articles from '../data/mydata.json' assert { type: "json" }
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const debug = Debug('app:adminRouter')
const adminRouter = express.Router()

mongoose.set('strictQuery', true);

const username = process.env.USERNAME
const password = process.env.PASSWORD
const cluster = process.env.CLUSTERNAME

adminRouter.route('/').get((req, res) => {
  const dbName = 'demo1'
  const url = `mongodb+srv://${username}:${password}@${cluster}.sabpl.mongodb.net/?retryWrites=true&w=majority`

  debug('Connecting DB ...')
  mongoose.connect(url, { dbName, useNewUrlParser: true, useUnifiedTopology: true })

  // Article model
  const Article = mongoose.model('Article', {
    id: { type: Number },
    title: { type: String },
    description: { type: String },
    startsAt: { type: String },
    endsAt: { type: String },
    room: { type: String },
    day: { type: String },
    format: { type: String },
    track: { type: String },
    level: { type: String }
  });
  // Function call
  Article.insertMany(articles).then(function () {
    debug("Data inserted")  // Success
  }).catch(function (error) {
    debug('error', error)      // Failure
  })
  debug('Done.')
  res.send('Done')
  // debug(client)
  // async function run () {
  //   try {
  //     debug('connecting')
  //     // await client.connect()
  //     debug('Connected to the mongo DB')
  //     const db = client.db(dbName)
  //     // const response = await db.collection('articles').insertMany(articles)
  //     // res.json(response)
  //   } catch (error) {
  //     debug('error: ', error.stack)
  //   } finally {
  //     debug('Closing')
  //     await client.close()
  //   }
  // }
})

export { adminRouter }