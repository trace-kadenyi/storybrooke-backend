const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  commenter: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: new Date(),
    required: true,
  },
  time: {
    type: String,
    default: new Date(),
    required: true,
  },
  edited: {
    type: Boolean,
    default: false,
  },
  likes: [String],
  story: {
    type: Schema.Types.ObjectId,
    ref: "Story",
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reply",
    },
  ],
});

module.exports = mongoose.model("Comment", CommentSchema);
