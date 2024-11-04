const signatureController = require("../controllers/signatureController");
const { requireAuth } = require("../middleware/authMiddleware");
const router = require("express").Router();

router.post("/", requireAuth, signatureController.createSignature);
router.get("/", requireAuth, signatureController.getSignature);
router.put("/:signatureId", requireAuth, signatureController.updateSignature);
router.delete(
  "/:signatureId",
  requireAuth,
  signatureController.deleteSignature
);

module.exports = router;
