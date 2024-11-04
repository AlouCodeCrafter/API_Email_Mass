// NB: A Revoir

// const request = require("supertest");
// const app = require("../server");
// const mongoose = require("mongoose");
// const signatureModel = require("../models/SignatureModel");

// let token;

// //  Avant tout les test on peu connecter a la base de donné et recupere un token jwt
// beforAll(async () => {
//   await mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });

//   //   simuler une conexion et recuperer un token
//   const res = await request(app).post("/api/user/login").send({
//     email: "alou@gmail.com",
//     password: "alou1234",
//   });

//   token = res.body.token;
// });

// // aprés tt les test fermons la conexion a la BD
// afterAll(async () => {
//   await mongoose.connection.close();
// });
