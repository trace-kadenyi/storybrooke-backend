const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/rolesList");
const usersController = require("../../controllers/usersController");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(usersController.getAllUsers)
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    usersController.updateUser
  );

router.route("/:id").get(usersController.getUser);
router.route("/username/:username").get(usersController.getUserByUsername);
router.route("/interests/:username").get(usersController.getUserInterests);
// router.route("/:username").delete(usersController.deleteUser);
router.route("/:username").delete(usersController.deleteUser);


module.exports = router;
