const logController = require("../controllers/logController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const router = require("express").Router();

router.get("/", requireAuth, logController.getUserLogs); // Pour les utilisateurs normaux
router.get("/admin", requireAuth, requireAdmin, logController.getAllLogs);

module.exports = router;
