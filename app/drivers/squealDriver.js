const express = require("express");
const squealDriver = express();
const SquealController = require("../controllers/SquealController");
const SquealModel = require("../models/SquealModel");
const SquealDto = require("../entities/dtos/SquelDto");
const AuthController = require("../controllers/AuthController")
const AuthModel = require("../models/AuthModel")

let squealController = new SquealController(new SquealModel());
let authController = new AuthController(new AuthModel());

squealDriver.use(express.json());
squealDriver.use(express.urlencoded({extended: true}));


squealDriver.get('/:id', async function (req, res){
    let requested_id = req.params['id'];
    let authenticatedUser = await authController.getAuthenticatedUser(req);
    let session_id = req.session.id;
    let squealCtrl = await squealController.getSqueal(requested_id, authenticatedUser, session_id);
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
        req.body.squeal.destinations = '';
        req.body.squeal.message_type = '';
        req.body.squeal.content = '';
    }

    let squealDto = new SquealDto();
    squealDto._id = (typeof req.body.squeal['_id'] !== 'undefined' ? req.body.squeal['_id']: null);
    squealDto.destinations = (typeof req.body.squeal['destinations'] !== 'undefined' ? req.body.squeal['destinations']: null);
    squealDto.message_type = (typeof req.body.squeal['message_type'] !== 'undefined' ? req.body.squeal['message_type']: null);
    squealDto.content = (typeof req.body.squeal['content'] !== 'undefined' ? req.body.squeal['content']: null);

    let ctrlOut = await squealController.postSqueal(squealDto, await authUser);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
    }
)

module.exports = squealDriver;

