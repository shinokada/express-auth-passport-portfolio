import passport from 'passport'
import { Strategy } from 'passport-local'
import redis from '../../lib/redis.js'
import Debug from 'debug'
const debug = Debug('app:localStrategy')

export default function localStrategy () {
  passport.use(
    new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      (email, password, done) => {
        (async function validateUser () {
          try {
            debug('Connected to the redis DB');

            const user = await redis.get(`user:admin:${email}`);

            if (user && JSON.parse(user).password === password) {
              done(null, user);
            } else {
              done(null, false);
            }
          } catch (error) {
            done(error, false);
          }
        })();
      }
    )
  );
};