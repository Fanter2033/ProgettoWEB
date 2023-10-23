const path = require("path");
const reactDir = path.join(__dirname, "../../public");

const express = require("express");
const reactDriver = express();
reactDriver.use(express.static(reactDir));

const AuthController = require("../../controllers/AuthController");
const AuthModel = require("../../models/AuthModel");
const authController = new AuthController(new AuthModel());

reactDriver.get("/", function(req, res) {
  const path = require("path");
  //serve the static files from react
  const reactDir = path.join(__dirname, '../../react-squealer/build');
  reactDriver.use(express.static(reactDir));
  res.sendFile(path.join(reactDir, '/index.html'));
  
  /*
  let logged = authController.isAuthLogged(req);
  if (logged) {
    //res.sendFile(path.join(reactDir, "/index.html"));

    //serve the static files from react
  } 
  else res.redirect("./userView");
  */
  //res.sendFile(publicDir + "/html/loginUser.html");
});

//TODO:
//reactDriver.get("/channels/", async (req, res) => {});

//reactDriver.get("/squeals/", async (req, res) => {});

//reactDriver.get("/account", async (req, res) => {});

module.exports = reactDriver;
