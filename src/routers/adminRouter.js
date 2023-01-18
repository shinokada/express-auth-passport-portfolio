import express from 'express'
import Debug from 'debug'
import { v4 as uuidv4 } from 'uuid'
import redis from '../lib/redis.js'

const debug = Debug('app:adminRouter')
const adminRouter = express.Router()

adminRouter.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/auth/signIn');
  }
});

adminRouter.route('/').get((req, res) => {
  const title = "Admin"
  res.render('admin', { title })
})


adminRouter.route('/create').get(async (req, res) => {
  const pageTitle = 'Create article'
  res.render('create', { title: pageTitle });
});

adminRouter.route('/create').post(async (req, res) => {
  // Get the form data from the request body
  const { title, description, content } = req.body;
  // Create a new article in the database
  // let article = await createArticle({ title, description, content });
  // let { title, description, content } = req.body

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
      res.status(400).json({ error: 'Description can not be empty' });
      return;
    }
    if (!newEntry.content) {
      res.status(400).json({ error: 'Content can not be empty' });
      return;
    }

    //stringify the new entry
    const newEntryAsString = JSON.stringify(newEntry);
    //save the new entry to redis
    await redis.set(`article:${id}`, newEntryAsString);
    // Redirect the user to the article page
    res.redirect(`/articles/${newEntry.id}`);
  }
});

adminRouter.route('/profile').get((req, res) => {
  const pageTitle = "Profile"
  debug('req.user: ', req.user)
  res.render('profile', { title: pageTitle, user: req.user });
});

export { adminRouter }