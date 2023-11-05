const express = require("express");
const squealDriver = express();
const SquealController = require("../controllers/SquealController");
const SquealModel = require("../models/SquealModel");
const SquealDto = require("../entities/dtos/SquelDto");
const UserController = require("../controllers/UserController");
const UserModel = require("../models/UserModel");
const AuthController = require("../controllers/AuthController")
const AuthModel = require("../models/AuthModel")

let squealController = new SquealController(new SquealModel());
let userController = new UserController(new UserModel());
let authController = new AuthController(new AuthModel());

squealDriver.use(express.json());
squealDriver.use(express.urlencoded({extended: true}));



squealDriver.get('/:id', async function (req, res){
    let squealCtrl = await squealController.getSqueal(req);
    if(squealCtrl.code === 200)
        res.status(squealCtrl.code).send(squealCtrl.content)
    else
        res.status(squealCtrl.code).send(squealCtrl)
})

squealDriver.post('/', async function(req, res){
    let authUser = authController.getAuthenticatedUser(req);

    if (typeof req.body === 'undefined' || typeof req.body.squeal === 'undefined') {
        req.body = {};
        req.body.squeal = {};
        req.body.squeal._id = '';
        req.body.squeal.destinations = '';
        req.body.squeal.sender = '';
        req.body.squeal.reactions = '';
        req.body.squeal.message_type = '';
        req.body.squeal.positive_value = '';
        req.body.squeal.negative_value = '';
        req.body.squeal.critical_mass = '';
        req.body.squeal.quote_cost = '';
        req.body.squeal.content = '';
    }

    let squealDto = new SquealDto();
    squealDto._id = (typeof req.body.squeal['_id'] !== 'undefined' ? req.body.squeal['_id']: null);
    squealDto.destinations = (typeof req.body.squeal['destinations'] !== 'undefined' ? req.body.squeal['destinations']: null);
    squealDto.sender = (typeof req.body.squeal['sender'] !== 'undefined' ? req.body.squeal['sender']: null);
    squealDto.reactions = (typeof req.body.squeal['reactions'] !== 'undefined' ? req.body.squeal['reactions']: null);
    squealDto.message_type = (typeof req.body.squeal['message_type'] !== 'undefined' ? req.body.squeal['message_type']: null);
    squealDto.positive_value = (typeof req.body.squeal['positive_value'] !== 'undefined' ? req.body.squeal['positive_value']: null);
    squealDto.negative_value = (typeof req.body.squeal['negative_value'] !== 'undefined' ? req.body.squeal['negative_value']: null);
    squealDto.critical_mass = (typeof req.body.squeal['critical_mass'] !== 'undefined' ? req.body.squeal['critical_mass']: null);
    squealDto.quote_cost = (typeof req.body.squeal['quote_cost'] !== 'undefined' ? req.body.squeal['quote_cost']: null);
    squealDto.content = (typeof req.body.squeal['content'] !== 'undefined' ? req.body.squeal['content']: null);

    let ctrlOut = await squealController.postSqueal(squealDto, await authUser);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
    }
)

module.exports = squealDriver;

