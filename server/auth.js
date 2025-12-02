const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const prisma = require('./database');

const findOrCreateUser = async (profile, provider) => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        provider: provider,
        providerId: profile.id
      }
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = await prisma.user.create({
      data: {
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
        username: profile.displayName || profile.username || `${provider}_user_${Date.now()}`,
        provider: provider,
        providerId: profile.id,
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
      }
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id }
    });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
async (email, password, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        provider: 'local'
      }
    });

    if (!user) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

const registerUser = async (email, password, username) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        username: username || email.split('@')[0],
        password: hashedPassword,
        provider: 'local',
        providerId: null,
        avatar: null,
      }
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};

module.exports = { passport, registerUser };

