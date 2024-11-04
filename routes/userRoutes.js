const router = require("express").Router();
const { Route } = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Admin réinitialise le mot de passe
router.patch(
  "/reset-password/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  authController.resetPasswordByAdmin
);
// Utilisateur change son mot de passe
router.post(
  "/change-password",
  authMiddleware.requireAuth,
  authController.changePassword
);

//User
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.userUpdate);
router.delete("/:id", userController.userDelete);

// auth Controller
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.post("/logout", authController.logout);

module.exports = router;
