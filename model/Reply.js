const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./Comment");

const ReplySchema = new Schema({
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
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
    });

module.exports = mongoose.model("Reply", ReplySchema);