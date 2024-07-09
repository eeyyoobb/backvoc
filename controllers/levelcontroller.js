const User = require('./models').User;
const Level = require('./models').Level;

async function updateUserLevel(userId, score) {
  const user = await User.findById(userId);
  const levels = await Level.find({});

  for (const level of levels) {
    if (score >= level.thresholdScore) {
      user.level = level.levelName;
    }
  }

  await user.save();
  return user.level;
}

module.exports = { updateUserLevel };