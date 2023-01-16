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
  const pageTitle = 'Sing-up'
  res.render('signup', { title: pageTitle });
})

authRouter.route('/signup').post((req, res) => {
  const { username, password } = req.body;
  redis.hset(username, 'password', password, (err, reply) => {
    if (err) {
      debug(err);
    } else {
      debug(reply);
      req.login(username, () => {
        res.redirect('/auth/profile');
      });
    }
  });
})

authRouter.route('/signin').get((req, res) => {
  const pageTitle = 'Sign-in'
  res.render('signin', { title: pageTitle });
}).post(
  passport.authenticate('local', {
    successRedirect: '/auth/profile',
    failureRedirect: '/',
  })
);


authRouter.route('/profile').get((req, res) => {
  res.json(req.user);
});

export { authRouter }