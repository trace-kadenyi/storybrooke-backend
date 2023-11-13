const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Story = require("./Story");

const GenreSchema = new Schema({
  genre: {
    type: String,
    required: true,
    unique: true,
  },
  stories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Story",
    },
  ],
});

module.exports = mongoose.model("Genre", GenreSchema);
