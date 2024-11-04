const express = require("express");
const userRoutes = require("./routes/userRoutes");
const emailRoutes = require("./routes/emailRoutes");
const signatureRoutes = require("./routes/signatureRoutes");
const logRoutes = require("./routes/logRoutes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const PORT = process.env.PORT;
const { checkUser, requireAuth } = require("./middleware/authMiddleware");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const app = express();

// Middleware pour parser les requêtes JSON et URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// JWT
app.get("/*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

// ROUTES
app.use("/api/user", userRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/signatures", signatureRoutes);
app.use("/api/logs", logRoutes);

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
