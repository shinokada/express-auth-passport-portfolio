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
    res.redirect('/auth/login');
  }
});

adminRouter.route('/').get((req, res) => {
  const title = "Admin Dashboard"
  res.render('admin', { title })
})


adminRouter.route('/profile').get((req, res) => {
  const pageTitle = "Profile"
  debug('req.user: ', req.user)
  res.render('profile', { title: pageTitle, user: JSON.parse(req.user) });
});

export { adminRouter }