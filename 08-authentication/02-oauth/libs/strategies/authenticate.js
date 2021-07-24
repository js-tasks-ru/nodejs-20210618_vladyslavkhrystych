const User = require('../../models/User');

module.exports = async function authenticate(
  strategy,
  email,
  displayName,
  done
) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  const user = await User.findOne({ email });

  if (!user) {
    const newUser = {
      email,
      displayName,
    };
    User.create(newUser, (err, createdUser) => {
      if (err) {
        return done(err, false, 'Некорректный email.');
      }

      return done(null, createdUser);
    });
  }

  done(null, user);
};
