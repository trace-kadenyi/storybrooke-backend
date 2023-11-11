const User = require("../model/User");

// update user interests using username
const updateUserInterests = async (req, res) => {
  // capitalize username
  req.body.username =
    req.body.username.charAt(0).toUpperCase() +
    req.body.username.slice(1).toLowerCase();
  // Check for username
  if (!req?.body?.username)
    return res.status(400).json({ message: "User name required." });
  // Find user
  const user = await User.findOne({ username: req.body.username }).exec();

  if (!user)
    return res
      .status(404)
      .json({ message: `No user matches username ${req.body.username}.` });

  if (req?.body?.interests) user.interests = req.body.interests;

  try {
    const result = await user.save();
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  updateUserInterests,
};
