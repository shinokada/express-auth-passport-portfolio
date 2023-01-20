import express from 'express'
import passport from 'passport'
import Debug from 'debug'
import redis from '../lib/redis.js'
import '../config/strategies/local.strategy.js'
import bcrypt from 'bcrypt'
import { body, validationResult } from 'express-validator'


const authRouter = express.Router()

const debug = Debug('app:authRouter')
const dbName = 'demo1'

authRouter.route('/').get((req, res) => {
  res.send('auth page');
});

authRouter.route('/signup').get((req, res) => {
  const pageTitle = 'Member Sing-up'
  res.render('signup', { title: pageTitle, errors: req.session.errors });
}).post([
  body('username').not().isEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup', { title: 'Member Sign-up', errors: errors.array() });
    }
    const { username, email, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    debug('Connected to the redis DB');
    // Check if email already exists
    const emailExists = await redis.exists(`user:member:${email}`);
    if (emailExists) {
      return res.render('signup', { title: 'Member Sign-up', errors: [{ msg: 'Email already exists' }] });
    }
    // Check if username already exists
    const usernameExists = await redis.exists(`username:member:${username}`);
    if (usernameExists) {
      return res.render('signup', { title: 'Member Sign-up', errors: [{ msg: 'Username already exists' }] });
    }
    const user = JSON.stringify({ username, email, password: hashedPassword });
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
}).post([
  body('email').isEmail().withMessage('Invalid email address'),
],
  //   passport.authenticate('local', {
  //   successRedirect: '/admin',
  //   failureRedirect: '/',
  // })
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', { title: 'Member Login', errors: errors.array() });
    }
    passport.authenticate('local', {
      successRedirect: '/admin',
      failureRedirect: '/',
    });
  }
);

authRouter.route('/logout').get((req, res) => {
  req.logout(); // provided by passport, removes the req.user property and clears the login session
  res.redirect('/'); // redirect to home page
});



export { authRouter }