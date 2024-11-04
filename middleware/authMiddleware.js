const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const maxAge = 3 * 24 * 60 * 60 * 1000;

// controle pour tester si l'utilisateur du navigateur est connecté tout au long de la navigation du site
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge });
        next();
      } else {
        console.log("decodedToken" + decodedToken);
        let user = await userModel.findById(decodedToken.id);
        res.locals.user = user;
        console.log(res.locals.user);
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(400).json({ message: "unauthorized" });
      } else {
        req.user = await userModel.findById(decodedToken.id);
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

// Middleware pour vérifier que l'utilisateur est un admin
module.exports.requireAdmin = (req, res, next) => {
  const user = req.user;
  if (user && user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message:
        "Accès refusé : vous devez être administrateur pour effectuer cette action.",
    });
  }
};
