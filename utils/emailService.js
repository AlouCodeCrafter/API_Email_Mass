require("dotenv").config({ path: "./config/.env" });
const nodemailer = require("nodemailer");

// config du transporteur
const transporter = nodemailer.createTransport({
  host: "webmail.senelec.sn",
  port: 25,
  secure: false,

  tls: {
    rejectUnauthorized: false,
  },
});

// fonction pour envoyer l'email avec nodemailer
const sendEmail = async ({
  sender,
  recipients,
  cc,
  bcc,
  subject,
  body,
  attachments,
}) => {
  try {
    console.log("Tentative d'envoi d'email...");
    console.log(`De: ${sender}, Vers: ${recipients}`);

    const info = await transporter.sendMail({
      from: sender,
      to: recipients.join(", "),
      cc: cc ? cc.join(",") : undefined,
      bcc: bcc ? bcc.join("") : undefined,
      subject,
      text: body,
      attachments: attachments,
    });
    console.log("Email envoyé avec succès:", info);
    return info;
  } catch (error) {
    console.error("Erreur lors de l'envoi d'email:", error);
    throw error;
  }
};

module.exports = { sendEmail };
