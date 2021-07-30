const User = require('../../models/User');

module.exports = async function authenticate(
  strategy,
  email,
  displayName,
  done
) {
  try {
    if (!email) {
      return done(null, false, 'Не указан email');
    }

    const user = await User.findOne({ email });

    if (!user) {
      const newUser = {
        email,
        displayName,
      };

      try {
        const createdUser = await User.create(newUser);

        return done(null, createdUser);
      } catch (err) {
        return done(err, false, 'Некорректный email.');
      }
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
};
