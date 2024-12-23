const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const Admin = require('../models/Admin.js');

const configurePassport = () => {
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, admin);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((admin, done) => {
    done(null, admin.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const admin = await Admin.findById(id);
      done(null, admin);
    } catch (error) {
      done(error);
    }
  });
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Export using CommonJS
module.exports = {
  configurePassport,
  isAuthenticated,
};
