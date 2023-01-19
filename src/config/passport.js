import passport from 'passport'
import localStrategy from './strategies/local.strategy.js'

localStrategy()

const passportConfig = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  // this is responsible for defining what data of the user object should be stored in the session
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  // this function is responsible for taking the user data that was stored in the session and converting it back into a user object.
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default passportConfig;