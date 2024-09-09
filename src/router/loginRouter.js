const connect = require("../database/database");
const express = require("express");
const loginRouter = express.Router();
const bcrypt = require("bcrypt");

loginRouter.post("/login", async (req, res) => {
  // const hashedPassword = await bcrypt.hash('yourPasswordInString');
  // console.log("hased: " + hashedPassword);

  let mongoClient;
  const { username, password } = req.body;

  try {
    mongoClient = await connect();

    const collection = mongoClient
      .db(process.env.DB_NAME)
      .collection(process.env.LOGIN_COLLECTIONS);

    const userCredential = await collection.find().toArray();

    const verifyPass = await bcrypt.compare(
      password,
      userCredential[0].password
    );

    if (username === userCredential[0].username && verifyPass) {
      req.session.userid = username;
      return res.status(200).redirect("/upload");
    } else return res.status(404).send("No records found");
  } catch (error) {
    console.error(error);
  }
});

module.exports = loginRouter;
