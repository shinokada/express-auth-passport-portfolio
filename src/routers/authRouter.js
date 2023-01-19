import express from 'express'
import passport from 'passport'
import Debug from 'debug'
import redis from '../lib/redis.js'
import '../config/strategies/local.strategy.js'


const authRouter = express.Router()

const debug = Debug('app:authRouter')
const dbName = 'demo1'

authRouter.route('/').get((req, res) => {
  res.send('auth page');
});

authRouter.route('/signup').get((req, res) => {
  const pageTitle = 'Member Sing-up'
  res.render('signup', { title: pageTitle });
}).post(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    debug('Connected to the redis DB');
    const user = JSON.stringify({ username, email, password });
    await redis.set(`user:member:${email}`, user);
    debug(`User ${username} added to Redis`);
    res.redirect('/auth/login');
  } catch (error) {
    debug(error);
  }
});


authRouter.route('/login').get((req, res) => {
  const pageTitle = 'Member Login'
  res.render('login', { title: pageTitle });
}).post(
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/',
  })
);

authRouter.route('/logout').get((req, res) => {
  req.logout(); // provided by passport, removes the req.user property and clears the login session
  res.redirect('/'); // redirect to home page
});



export { authRouter }