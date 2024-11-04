const router = require("express").Router();
const emailController = require("../controllers/emailController");
const uploads = require("../middleware/multerMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/send",
  authMiddleware.requireAuth,
  uploads.array("attachments"),
  emailController.sendEmail
);

router.get("", authMiddleware.requireAuth, emailController.getAllEmail);
module.exports = router;
