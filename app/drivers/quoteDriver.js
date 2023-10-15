const express = require("express");
const quoteDriver = express();
const QuoteController = require("../controllers/QuoteController");
const QuoteModel = require("../models/QuoteModel");
const QuoteDto = require("../entities/dtos/QuoteDto");
let controller = new QuoteController(new QuoteModel());



module.exports = quoteDriver;

