const userModel = require("../models/userModel");
const logModel = require("../models/logModel");
const requireAuth = require("../middleware/authMiddleware");

module.exports.createLog = async (emailData) => {
  try {
    const newLog = new logModel({
      userId: emailData.userId,
      sender: emailData.sender,
      recipients: emailData.recipients,
      cc: emailData.cc,
      bcc: emailData.bcc,
      subject: emailData.subject,
      body: emailData.body,
      attachments: emailData.attachments,
    });

    await newLog.save();
    console.log("Log créé avec succès.");
  } catch (error) {
    console.error("Erreur lors de la création du log :", error);
  }
};

module.exports.getUserLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await logModel
      .find({ userId })
      .populate("userId", "pseudo email"); // Popule les données de l'utilisateur
    res.status(200).json(logs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des logs", error });
  }
};

// Récupérer tous les logs pour un admin
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await logModel.find().populate("userId", "pseudo email");

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des logs",
      error: error.message,
    });
  }
};
