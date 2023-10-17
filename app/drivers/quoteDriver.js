const express = require("express");
const quoteDriver = express.Router({mergeParams: true});
const QuoteController = require("../controllers/QuoteController");
const QuoteModel = require("../models/QuoteModel");
let controller = new QuoteController(new QuoteModel());
quoteDriver.get('/', async function (req, res) {
    let ctrlOut = await controller.getQuote(req.params['username']);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});

module.exports = quoteDriver;

