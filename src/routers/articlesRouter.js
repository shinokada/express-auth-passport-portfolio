import express from 'express'
// you need to add assert { type: "json" } to import JSON in ES modules
import data from '../data/mydata.json' assert { type: "json" }
const articlesRouter = express.Router()

articlesRouter.route('/').get((req, res) => {
  res.render('articles', {
    data,
  })
})
// articles/any-id
articlesRouter.route('/:id').get((req, res) => {
  const id = req.params.id
  res.render('article', {
    data: data[id]
  }
  )
})

export { articlesRouter }