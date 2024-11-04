const mongoose = require("mongoose");

// On suppose que les enregistrements de chaque email envoyé sont déjà enregistrés dans un modèle Log

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  sender: {
    type: String,
    required: true,
  },
  recipients: [String], // liste de destinataires
  cc: [String], // liste des CC
  bcc: [String], // liste des BCC
  subject: {
    type: String,
  },
  body: {
    type: String,
  },
  attachments: [
    {
      filename: String,
      path: String,
    },
  ],
  subject: { type: String },
  sentAt: { type: Date, default: Date.now },
});

const log = mongoose.model("log", logSchema);

module.exports = log;
