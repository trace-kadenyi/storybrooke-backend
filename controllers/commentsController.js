const Comment = require("../model/Comment");
const Story = require("../model/Story");
const Genre = require("../model/Genre");
const User = require("../model/User");
const Reply = require("../model/Reply");

// CREATE A NEW COMMENT
const createComment = async (req, res) => {
  //   get story id from params
  const storyId = req?.params?.id;

  //   check if story id is valid
  const story = await Story.findOne({ _id: storyId });
  if (!story) {
    res.status(404).json({ message: "Story not found" });
    return;
  }
  const commenter =
    req.body.commenter.charAt(0).toUpperCase() +
    req.body.commenter.slice(1).toLowerCase();
  const body = req.body.body;
  const date = new Date();
  const time = new Date();

  //   create new comment
  const newComment = new Comment({
    commenter,
    body,
    story: storyId,
    date,
    time,
  });

  //   save comment
  try {
    await newComment.save();
    //   add comment to story
    story.comments.push(newComment);
    //   save story
    await story.save();
    //  send response
    res.status(201).json({
      comment: newComment,
      message: "Comment added successfully!",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL COMMENTS FOR A STORY
const getComments = async (req, res) => {
  // check if no params
  if (!req?.params?.id) {
    res.status(400).json({ message: "No story id provided" });
    return;
  }

  //   get story id from params
  const story = await Story.findOne({ _id: req.params.id }).exec();

  if (!story) {
    return res
      .status(404)
      .json({ message: `Story with id ${req.params.id} not found.` });
  }

  // if no comments in story
  if (story.comments.length === 0) {
    return res
      .status(200)
      .json({ message: `No comments found in story ${req.params.id}.` });
  }

  // populate comments
  const comments = await Comment.find({ _id: { $in: story.comments } }).exec();

  // sort comments by date (newest to oldest)
  comments.sort((a, b) => b.date - a.date);

  res.status(200).json(comments.map((comment) => comment));
};

// DELETE A COMMENT
const deleteComment = async (req, res) => {
  // check if no params
  if (!req?.params?.id) {
    res.status(400).json({ message: "No comment id provided" });
    return;
  }

  //   get comment id from params
  const commentId = req?.params?.id;

  //   check if comment id is valid
  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    res.status(404).json({ message: "Comment not found" });
    return;
  }

  //   delete comment
  try {
    await Comment.deleteOne({ _id: commentId });
    //  delete comment from story
    await Story.updateOne(
      { _id: comment.story },
      { $pull: { comments: commentId } }
    ).exec();

    // delete replies in comment
    await Reply.deleteMany({ comment: commentId }).exec();

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE A COMMENT
const updateComment = async (req, res) => {
  //   get comment id from params
  const commentId = req?.params?.id;

  // check if comment exists in db
  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    res.status(404).json({ message: "Comment not found" });
    return;
  }

  // new comment
  const newComment = {
    _id: commentId,
    commenter:
      req.body.commenter.charAt(0).toUpperCase() +
      req.body.commenter.slice(1).toLowerCase(),
    body: req.body.body,
    date: new Date(),
    time: new Date(),
    story: comment.story,
    replies: comment.replies,
    edited: true,
  };
  // update comment
  try {
    await Comment.updateOne({ _id: commentId }, newComment);

    // send response
    res.status(200).json({ message: "Comment updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// CREATE COMMENT REPLY
const createCommentReply = async (req, res) => {
  //   get comment id from params
  const commentId = req?.params?.id;

  //   check if comment id is valid
  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    res.status(404).json({ message: "Comment not found" });
    return;
  }

  // let dateObj = new Date();
  // let options = {
  //   year: "numeric",
  //   month: "short",
  //   day: "numeric",
  // };

  const commenter =
    req.body.commenter.charAt(0).toUpperCase() +
    req.body.commenter.slice(1).toLowerCase();
  const body = req.body.body;
  // const date = dateObj.toLocaleDateString(undefined, options);
  const date = new Date();
  // const time = dateObj.toLocaleTimeString();
  const time = new Date().toLocaleTimeString();

  // creste new reply
  const newReply = new Reply({
    commenter,
    body,
    date,
    time,
    comment: commentId,
  });

  //   save reply
  try {
    await newReply.save();
    //   add reply to comment
    comment.replies.push(newReply);
    //   save comment
    await comment.save();
    //  send response
    res.status(201).json({
      reply: newReply,
      message: "Reply added successfully!",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE REPLY
const deleteReply = async (req, res) => {
  // check if no params
  if (!req?.params?.id) {
    res.status(400).json({ message: "No reply id provided" });
    return;
  }

  // get reply id from params
  const replyId = req?.params?.id;

  // find the comment that contains the reply
  const commentContainingReply = await Comment.findOne({ replies: replyId });

  // delete reply
  try {
    await Reply.deleteOne({ _id: replyId });

    // delete reply from comment
    await Comment.updateOne(
      { _id: commentContainingReply._id },
      { $pull: { replies: replyId } }
    ).exec();

    res.status(200).json({ message: "Reply deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL REPLIES FOR A COMMENT
const getReplies = async (req, res) => {
  // check if no params
  if (!req?.params?.id) {
    res.status(400).json({ message: "No comment id provided" });
    return;
  }

  //   get story id from params
  const comment = await Comment.findOne({ _id: req.params.id }).exec();

  if (!comment) {
    return res
      .status(404)
      .json({ message: `Comment with id ${req.params.id} not found.` });
  }

  // if no replies in comment
  if (comment.replies.length === 0) {
    return res
      .status(200)
      .json({ message: `No replies found in comment ${req.params.id}.` });
  }

  // populate replies
  const replies = await Reply.find({ _id: { $in: comment.replies } }).exec();

  // sort replies by date (newest to oldest)
  replies.sort((a, b) => b.date - a.date);

  res.status(200).json(replies.map((reply) => reply));
};

module.exports = {
  createComment,
  getComments,
  deleteComment,
  updateComment,
  createCommentReply,
  deleteReply,
  getReplies,
};
