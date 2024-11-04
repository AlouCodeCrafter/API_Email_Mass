const userModel = require("../models/userModel");
const tokenModel = require("../models/tokenModel");
const emailService = require("../utils/emailService");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./config/.env" });
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require("../utils/erros.util");
const objectID = require("mongoose").Types.ObjectId;

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

// generer un refresh token et l'enregistre en  base
const createRefreshToken = async (userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

  await tokenModel.create({ userId, token: refreshToken, expiresAt });
  return refreshToken;
};

module.exports.signUp = async (req, res) => {
  const { pseudo, email, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ errors: { password: "les mot de passe ne correspondent pas " } });
  }

  try {
    const user = await userModel.create({
      pseudo,
      email,
      password,
      confirmPassword,
      role,
    });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = signUpErrors(error);
    res.status(400).send({ errors });
  }
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.login(email, password);
    if (user.isTemporaryPassword) {
      return res.status(403).json({
        message: "Votre mot de passe est temporaire. Veuillez le changer.",
        requiresPasswordChange: true, // Ajout d'un flag pour le frontend
      });
    }
    const token = createToken(user._id);
    const refreshToken = await createRefreshToken(user._id);

    // Envoi des tokens dans les cookies
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ user: user._id });
  } catch (error) {
    console.log("login err:", error);

    const errors = signInErrors(error);
    res.status(400).json({ errors });
  }
};
module.exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    // Suppression du token en base de données
    await tokenModel.findOneAndDelete({ token: refreshToken });

    // Nettoyage des cookies
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("refreshToken", "", { maxAge: 1 });

    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ___________________________________________________________________________________________________________________
// _____________________________________________________________________________________________________________________

// fonction pour generer un mot de passe temporaire
function generateTemporaryPassword(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}

module.exports.resetPasswordByAdmin = async (req, res) => {
  const { id } = req.params; // l'id de l'utilisateur a reinitialiser

  if (!id || !objectID.isValid(id)) {
    return res.status(403).send("ID inconnu" + id);
  }

  try {
    // generer et hacher les mot de passe
    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    //mettre a jour le mot de passe et definir mustChangePassword
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword, mustChangePassword: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    // Retourner le mot de passe temporaire dans la réponse
    res.status(200).json({
      message: "Mot de passe réinitialisé avec succès",
      temporaryPassword: temporaryPassword,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "erreur lors de la reinitialisation de mot de passe " });
  }
};

module.exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = req.user;
    if (!user) return res.status(404).send("utilisateur non trouvé");

    // verification du mot de passe actuelle
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).send("Mot de passe actuel incorrect.");

    // Hacher et mettre à jour le nouveau mot de passe
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.mustChangePassword = false; // Retirer l'indicateur de mot de passe temporaire
    await user.save();

    res.status(200).send("Mot de passe mis à jour avec succès.");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
