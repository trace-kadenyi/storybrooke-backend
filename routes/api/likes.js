const express = require("express");
const router = express.Router();
const likesController = require("../../controllers/likesController");

router.route("/comments/:id").put(likesController.updateCommentLikes);
router.route("/replies/:id").put(likesController.updateReplyLikes);

module.exports = router;
