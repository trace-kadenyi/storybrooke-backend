const User = require("../model/User");
const Story = require("../model/Story");
const Profile = require("../model/Profile");
const Genre = require("../model/Genre");
const Comment = require("../model/Comment");
const Reply = require("../model/Reply");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No users found." });
  res.status(200).json(users);
};

const updateUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "ID parameter is required." });

  const user = await User.findOne({ _id: req.body.id }).exec();

  if (!user)
    return res
      .status(204)
      .json({ message: `No user matches ID ${req.body.id}.` });

  const hashedPwd = await bcrypt.hash(req.body.pwd, 10);

  if (req?.body?.user) user.username = req.body.user;
  if (req?.body?.roles) user.roles = req.body.roles;
  if (req?.body?.pwd) user.password = hashedPwd;
  if (req?.body?.interests) user.interests = req.body.interests;

  try {
    const result = await user.save();
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
  }
};

const deleteUser = async (req, res) => {
  if (!req?.params?.username)
    return res.status(400).json({ message: "Username required." });

  // capitalize username
  req.params.username =
    req.params.username.charAt(0).toUpperCase() +
    req.params.username.slice(1).toLowerCase();

  // Find user
  const user = await User.findOne({ username: req.params.username }).exec();

  if (!user)
    return res
      .status(404)
      .json({ message: `No user matches username ${req.params.username}.` });

  // Delete user's stories
  const storiesToDelete = await Story.find({ author: user.username }).exec();
  await Story.deleteMany({
    author: user.username,
  }).exec();

  // delete story ids from genres
  await Genre.updateMany(
    { stories: { $in: storiesToDelete.map((story) => story._id) } },
    { $pull: { stories: { $in: storiesToDelete.map((story) => story._id) } } }
  ).exec();

  // delete comments in stories
  const commentsToDelete = await Comment.find({
    story: { $in: storiesToDelete.map((story) => story._id) },
  }).exec();
  await Comment.deleteMany({
    story: { $in: storiesToDelete.map((story) => story._id) },
  }).exec();

  // delete replies in comments
  await Reply.deleteMany({
    comment: { $in: commentsToDelete.map((comment) => comment._id) },
  }).exec();

  // Delete user's profile
  await Profile.deleteOne({
    username: user.username,
  }).exec();

  // Delete user
  await User.deleteOne({
    username: user.username,
  }).exec();

  // Return message
  res.status(200).json({
    message: `User ${req.params.username} deleted.`,
  });
};

// GET USER
const getUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required." });

  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `No user matches ID ${req.params.id}.` });
  }
  res.json(user);
};

// GET USER BY USERNAME
const getUserByUsername = async (req, res) => {
  if (!req?.params?.username)
    return res.status(400).json({ message: "Username required." });

  // capitalize username
  req.params.username =
    req.params.username.charAt(0).toUpperCase() +
    req.params.username.slice(1).toLowerCase();

  const user = await User.findOne({ username: req.params.username }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `No user matches name ${req.params.username}.` });
  }
  res.json(user.roles);
};

// GET USER INTERESTS
const getUserInterests = async (req, res) => {
  // capitalize username
  req.params.username =
    req.params.username.charAt(0).toUpperCase() +
    req.params.username.slice(1).toLowerCase();
  // Check for username
  if (!req?.params?.username)
    return res.status(400).json({ message: "User name required." });
  // Find user
  const user = await User.findOne({ username: req.params.username }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `No user matches name ${req.params.username}.` });
  }
  // Return user's interests
  res.json(user.interests);
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  getUser,
  getUserInterests,
  getUserByUsername,
};
