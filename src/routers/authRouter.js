import express from 'express'
import passport from 'passport'
import chalk from 'chalk'
import Debug from 'debug'
import redis from '../lib/redis.js'
import '../config/strategies/local.strategy.js'
import bcrypt from 'bcrypt'
import { body, validationResult } from 'express-validator'
import { generateUniqueId } from '../lib/utils.js'


const authRouter = express.Router()

const debug = Debug('app:authRouter')
const dbName = 'demo1'

authRouter.route('/').get((req, res) => {
  res.redirect('/signup');
});

authRouter.route('/signup').get((req, res) => {
  const title = 'Member Sing-up'
  res.render('signup', { title, errors: req.session.errors });
}).post([
  body('username').not().isEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters')
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
    const usernameExists = await redis.exists(`username:${username}:id`);
    if (usernameExists) {
      return res.render('signup', { title: 'Member Sign-up', errors: [{ msg: 'Username already exists' }] });
    }

    const userId = generateUniqueId(); // generate a unique user ID

    // username:${username}:id is used to check if username already exists 
    // By including :id as part of the key, you are indicating that the value being stored is the user's ID and it is associated with the specific username.

    await redis.set(`username:${username}:id`, userId);
    const user = JSON.stringify({ username, email, password: hashedPassword, isAdmin: false });
    await redis.set(`user:member:${email}`, user);
    debug(`User ${username} added to Redis`);
    res.redirect('/auth/login');
  } catch (error) {
    debug(error);
  }
});


authRouter.route('/login').get((req, res) => {
  const pageTitle = 'Member Login'
  res.render('login', { title: pageTitle, errors: req.session.errors });
})

authRouter.route('/login').post(
  [
    body('email').isEmail().withMessage('Invalid email address'),
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', { title: 'Member Login', errors: errors.array() });
    }
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user && info && info.message === 'Incorrect password') {
        return res.render('login', { title: 'Member Login', errors: [{ msg: info.message }] });
      }
      if (!user) {
        return res.render('login', { title: 'Member Login', errors: [{ msg: "We can't find your email. Please register." }] });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        // const userData = JSON.parse(user);
        req.user = user;
        console.log('Redirecting to admin ...')
        return res.redirect('/admin');
      });
    })(req, res, next);
  }
);


authRouter.route('/logout').get((req, res) => {
  req.logout(); // provided by passport, removes the req.user property and clears the login session
  res.redirect('/'); // redirect to home page
});



export { authRouter }