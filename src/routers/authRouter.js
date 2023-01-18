import express from 'express'
import passport from 'passport'
import Debug from 'debug'
import redis from '../lib/redis.js'
import '../config/strategies/local.strategy.js'


const authRouter = express.Router()

const debug = Debug('app:auth')
const dbName = 'demo1'

authRouter.route('/testing').get(async (req, res) => {
  debug('Test page!')
  res.send('done')
})

authRouter.route('/').get((req, res) => {
  res.send('auth page');
});

authRouter.route('/signup').get((req, res) => {
  const pageTitle = 'Member Sing-up'
  res.render('signup', { title: pageTitle });
}).post(async (req, res) => {
  try {
    const { username, password } = req.body;
    debug('Connected to the redis DB');

    const user = JSON.stringify({ username, password });
    await redis.set(`user:member:${username}`, user);
    debug(`User ${username} added to Redis`);

    req.login(JSON.parse(user), () => {
      res.redirect('/auth/signin');
    });
  } catch (error) {
    debug(error);
  }
});


authRouter.route('/signin').get((req, res) => {
  const pageTitle = 'Member Sign-in'
  res.render('signin', { title: pageTitle });
}).post(
  passport.authenticate('local', {
    successRedirect: '/admin/profile',
    failureRedirect: '/',
  })
);

authRouter.route('/logout').get((req, res) => {
  req.logout(); // provided by passport, removes the req.user property and clears the login session
  res.redirect('/'); // redirect to home page
});
// authRouter.route('/profile').get((req, res) => {
//   const pageTitle = "Profile"
//   debug('req.user: ', req.user)
//   res.render('profile', { title: pageTitle, user: req.user });
// });

export { authRouter }