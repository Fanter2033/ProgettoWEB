const express = require("express");
const squealDriver = express();
const SquealController = require("../controllers/SquealController");
const SquealModel = require("../models/SquealModel");

let controller = new SquealController(new SquealModel());

squealDriver.use(express.json());
squealDriver.use(express.urlencoded({extended: true}));


