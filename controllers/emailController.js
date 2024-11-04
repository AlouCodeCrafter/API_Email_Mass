const emailModel = require("../models/emailModel");
const { sendEmail } = require("../utils/emailService");
const { createLog } = require("../controllers/logController");

module.exports.sendEmail = async (req, res) => {
  const { sender, recipients, cc, bcc, subject, body } = req.body;

  try {
    const attachments = req.files
      ? req.files.map((file) => ({
          filename: file.originalname,
          path: file.path,
        }))
      : [];

    //creer l'email en base de donné etat "pending"
    const email = await emailModel.create({
      sender,
      recipients,
      cc,
      bcc,
      subject,
      body,
      attachments,
    });

    //envoyer l'email via le service
    const info = await sendEmail({
      sender,
      recipients,
      cc,
      bcc,
      subject,
      body,
      attachments,
    });

    //mis a jour email apres envoie reussi
    email.status = "sent";
    email.sentAt = new Date();
    await email.save();

    // Enregistrer un log de l'envoi dans la base de données
    await createLog({
      userId: req.user.id, // ID de l'utilisateur connecté
      sender,
      recipients,
      cc,
      bcc,
      subject,
      body,
      attachments,
    });

    res.status(200).json({ message: "email sent successfull", info });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.getAllEmail = async (req, res) => {
  try {
    const emails = await emailModel.find();
    res.status(200).json(emails);
  } catch (error) {
    res.status("400").json({ message: error.message });
  }
};
