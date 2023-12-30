const Comment = require("../model/Comment");
const Reply = require("../model/Reply");

// update comment likes
const updateCommentLikes = async (req, res) => {
  // check if comment id is valid
  const comment = await Comment.findOne({ _id: req.params.id });

  if (!comment) {
    res.status(404).json({ message: "Comment not found" });
    return;
  }

  // update comment likes
  try {
    comment.likes = req.body.likes;
    await comment.save();
    res.status(200).json({ message: "Comment likes updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// update reply likes
const updateReplyLikes = async (req, res) => {
  // check if reply id is valid
  const reply = await Reply.findOne({ _id: req.params.id });

  if (!reply) {
    res.status(404).json({ message: "Reply not found" });
    return;
  }

  // update reply likes
  try {
    reply.likes = req.body.likes;
    await reply.save();
    res.status(200).json({ message: "Reply likes updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  updateCommentLikes,
  updateReplyLikes,
};
