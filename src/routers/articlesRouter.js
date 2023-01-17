import express from 'express'
import Debug from 'debug'
import redis from '../lib/redis.js'
import { v4 as uuidv4 } from 'uuid'

const debug = Debug('app:adminRouter')
const articlesRouter = express.Router()

articlesRouter.route('/').get(async (req, res) => {
  debug('in article route')
  try {
    let articles = await redis.keys('article:*');
    let articlesData = await redis.mget(...articles);
    articles = articlesData.map(JSON.parse);
    debug('articles: ', articles)
    const pageTitle = 'Admin: Articles'
    res.render('articles', { articles, title: pageTitle })
  } catch (error) {
    debug('error', error)
  }
})

articlesRouter.route('/create').get(async (req, res) => {
  if (!req.user) {
    res.redirect('/auth/signIn');
  }

  const pageTitle = 'Create article'
  res.render('create', { title: pageTitle });
});

articlesRouter.route('/create').post(async (req, res) => {
  if (!req.user) {
    res.redirect('/auth/signIn');
  }

  const { title, description, content } = req.body;

  if (!title) {
    res.status(400).json({
      error: 'Title can not be empty',
    })
  } else if (title.length < 150) {
    const id = uuidv4();
    const newEntry = {
      id,
      title,
      created_at: Date.now(),
      description,
      content
    }
    //validate the newEntry
    if (!newEntry.description) {
      return res.status(400).json({ error: 'Description can not be empty' });
    }
    if (!newEntry.content) {
      return res.status(400).json({ error: 'Content can not be empty' });
    }

    //stringify the new entry
    const newEntryAsString = JSON.stringify(newEntry);
    //save the new entry to redis
    await redis.set(`article:${id}`, newEntryAsString);
    // Redirect the user to the article page
    res.redirect(`/articles/${newEntry.id}`);
  }
});

// articles/any-id
articlesRouter.route('/:id').get(async (req, res) => {
  const id = req.params.id
  try {
    debug('Connecting DB ...')
    let article = await redis.get(`article:${id}`);
    debug('article: ', article)
    if (!article) {
      res.status(404).render('404', { message: `Article with id ${id} not found`, title: '404' });
    } else {
      let articleData = JSON.parse(article);
      const pageTitle = 'Article'
      res.render('article', { article: articleData, title: pageTitle });
    }
  } catch (error) {
    debug('error', error)
  }
})


export { articlesRouter }