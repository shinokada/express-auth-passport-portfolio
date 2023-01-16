import passport from 'passport'
import { Strategy } from 'passport-local'
import redis from '../../lib/redis.js'
import Debug from 'debug'
const debug = Debug('app:localStrategy')

export default function localStrategy () {
  passport.use(
    new Strategy(
      {
        emailField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          debug('Connected to the Redis DB');
          const user = JSON.parse(await redis.get(`user:${email}`));

          if (user && user.password === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};