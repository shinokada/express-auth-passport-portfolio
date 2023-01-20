import passport from 'passport'
import { Strategy } from 'passport-local'
import redis from '../../lib/redis.js'
import Debug from 'debug'
import bcrypt from 'bcrypt';

const debug = Debug('app:localStrategy')

export default function localStrategy () {
  passport.use(
    new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          debug('Connected to the redis DB');

          const user = await redis.get(`user:member:${email}`);
          if (user) {
            const userData = JSON.parse(user);
            const isValid = await bcrypt.compare(password, userData.password);
            if (isValid) {
              done(null, user);
            } else {
              done(null, false);
            }
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
