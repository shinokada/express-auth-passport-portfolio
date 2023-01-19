import passport from 'passport';

export const isAuth = (req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
}
