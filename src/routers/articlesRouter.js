import express from 'express'
// you need to add assert { type: "json" } to import JSON in ES modules
import articles from '../data/mydata.json' assert { type: "json" }
const articlesRouter = express.Router()

articlesRouter.route('/').get((req, res) => {
  res.render('articles', {
    articles,
  })
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