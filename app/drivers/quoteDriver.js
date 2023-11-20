const express = require("express");
const quoteDriver = express.Router({ mergeParams: true });
const QuoteController = require("../controllers/QuoteController");
const QuoteModel = require("../models/QuoteModel");
let controller = new QuoteController(new QuoteModel());
const AuthController = require("../controllers/AuthController");
const AuthModel = require("../models/AuthModel");
let authController = new AuthController(new AuthModel());

quoteDriver.get("/", async function (req, res) {
  let ctrlOut = await controller.getQuote(req.params["username"]);
  if (ctrlOut.code === 200) res.status(ctrlOut.code).send(ctrlOut.content);
  else res.status(ctrlOut.code).send(ctrlOut);
});

//params -> URI
//body -> corpo dell'obj
quoteDriver.patch("/", async function (req, res) {
  let userAuth = await authController.getAuthenticatedUser(req);
  let username = typeof req.params["username"] !== "undefined" ? req.params["username"] : "";
  let percentage = typeof req.body["percentage"] !== "undefined" ? req.body["percentage"] : -1;
  let ctrlOut = await controller.applyPercentageQuote(userAuth, username, percentage);
  if (ctrlOut.code === 200) res.status(ctrlOut.code).send(ctrlOut.content);
  else res.status(ctrlOut.code).send(ctrlOut);
});

module.exports = quoteDriver;
