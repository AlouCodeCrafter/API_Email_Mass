const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 55,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["admin", "user"], // Définir différents rôles (admin ou utilisateur standard)
    default: "user",
  },
  isTempoaryPassword: { type: Boolean, default: false },
  isActive: {
    type: Boolean,
    default: true, // Indique si le compte est actif ou non
  },
});

//middleware pour aquer le mot de passe avant de sauvegarder
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe lors de la connexion
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("email inconnu");
  }

  const auth = await bcrypt.compare(password, user.password); // Comparaison des mots de passe
  if (!auth) {
    throw Error("password incorrect");
  }

  return user;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
