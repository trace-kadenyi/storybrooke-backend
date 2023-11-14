const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Story = require("./Story");
const Reply = require("./Reply");

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
    default: new Date().toLocaleDateString(),
    required: true,
  },
  time: {
    type: String,
    default: new Date().toLocaleTimeString(),
    required: true,
  },
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
