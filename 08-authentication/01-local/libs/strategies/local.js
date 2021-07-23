const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
  { usernameField: 'email', session: false },
  async function (email, password, done) {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('no user with such name');
      return done(null, false, 'Нет такого пользователя');
    }

    const isValidPassword = await user.checkPassword(password);

    if (!isValidPassword) {
      console.log('incorrect password');
      return done(null, false, 'Неверный пароль');
    }

    return done(null, user);
  }
);
