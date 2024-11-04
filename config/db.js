const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => console.log("MongoDb Connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err.message));
