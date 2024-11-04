const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  recipients: {
    type: [String],
    required: true,
  },
  cc: {
    type: [String],
    default: [],
  },
  bcc: {
    type: [String],
    default: [],
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  attachments: {
    type: [Object],
    default: [],
  },
  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sentAt: {
    type: Date,
  },
});

const emailModel = mongoose.model("email", emailSchema);
module.exports = emailModel;
