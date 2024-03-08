const Comment = require("../model/Comment");
const Reply = require("../model/Reply");
const User = require("../model/User");

// update comment likes
const updateCommentLikes = async (req, res) => {
  try {
    // check if comment id is valid
    const comment = await Comment.findOne({ _id: req.params.id });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // get username from body
    const username = req.body.username;

    // Check if the user has already liked the comment
    if (comment.likes.includes(username)) {
      // remove username
      comment.likes = comment.likes.filter((like) => like !== username);
      await comment.save();
      return res.status(200).json({ message: "Comment unliked successfully" });
    }

    // Update comment likes
    comment.likes.push(username);
    await comment.save();

    return res.status(200).json({ message: "Comment liked successfully" });
  } catch (error) {
    console.error("Error updating comment likes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get comment likes
const getCommentLikes = async (req, res) => {
  try {
    // check if comment id is valid
    const comment = await Comment.findOne({ _id: req.params.id });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({ likes: comment.likes.length });
  } catch (error) {
    console.error("Error getting comment likes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update reply likes
const updateReplyLikes = async (req, res) => {
  try {
    // check if reply id is valid
    const reply = await Reply.findOne({ _id: req.params.id });

    // if (!reply) {
    //   return res.status(404).json({ message: "reply not found" });
    // }

    // get username from body
    const username = req.body.username;

    // Check if the user has already liked the comment
    if (reply.likes.includes(username)) {
      // remove username
      reply.likes = reply.likes.filter((like) => like !== username);
      await reply.save();
      return res.status(200).json({ message: "Reply unliked successfully" });
    }

    // Update comment likes
    reply.likes.push(username);
    await reply.save();

    return res.status(200).json({ message: "Reply liked successfully" });
  } catch (error) {
    console.error("Error updating reply likes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get reply likes
const getReplyLikes = async (req, res) => {
  try {
    // check if reply id is valid
    const reply = await Reply.findOne({ _id: req.params.id });

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    return res.status(200).json({ likes: reply.likes.length });
  } catch (error) {
    console.error("Error getting reply likes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateCommentLikes,
  updateReplyLikes,
  getCommentLikes,
  getReplyLikes,
};
