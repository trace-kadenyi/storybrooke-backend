const express = require("express");
const router = express.Router();
const likesController = require("../../controllers/likesController");

router.route("/comment/:id").put(likesController.updateCommentLikes);
router.route("/reply/:id").put(likesController.updateReplyLikes);
router.route("/comment/:id").get(likesController.getCommentLikes);
router.route("/reply/:id").get(likesController.getReplyLikes);
router.route("/story/:id").put(likesController.updateStoryLikes);
router.route("/story/:id").get(likesController.getStoryLikes);

module.exports = router;
