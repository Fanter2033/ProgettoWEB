const express = require("express");
const squealDriver = express();
const SquealController = require("../controllers/SquealController");
const SquealModel = require("../models/SquealModel");

let controller = new SquealController(new SquealModel());

squealDriver.use(express.json());
squealDriver.use(express.urlencoded({extended: true}));



squealDriver.get('/:id', async function (req, res){
    let squealCtrl = await controller.getSqueal(req);
    if(squealCtrl.code === 200)
        res.status(squealCtrl.code).send(squealCtrl.content)
    else
        res.status(squealCtrl.code).send(squealCtrl)
})