const express = require("express");
const squealDriver = express();
const SquealController = require("../controllers/SquealController");
const SquealModel = require("../models/SquealModel");
const SquealDto = require("../entities/dtos/SquealDto");
const AuthController = require("../controllers/AuthController")
const AuthModel = require("../models/AuthModel")
const SquealTextAutoDto = require("../entities/dtos/SquealTextAutoDto");

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
        req.body.squeal.auto_iterations = '';
        req.body.squeal.auto_seconds_delay = '';
    }

    let squealDto = new SquealDto();
    let autoSqueal = new SquealTextAutoDto();
    squealDto._id = (typeof req.body.squeal['_id'] !== 'undefined' ? req.body.squeal['_id']: null);
    squealDto.destinations = (typeof req.body.squeal['destinations'] !== 'undefined' ? req.body.squeal['destinations']: null);
    squealDto.message_type = (typeof req.body.squeal['message_type'] !== 'undefined' ? req.body.squeal['message_type']: null);
    squealDto.content = (typeof req.body.squeal['content'] !== 'undefined' ? req.body.squeal['content']: null);

    autoSqueal.iteration_end = (typeof req.body.squeal['auto_iterations'] !== 'undefined' ? req.body.squeal['auto_iterations']: null);
    autoSqueal.next_scheduled_operation = (typeof req.body.squeal['auto_seconds_delay'] !== 'undefined' ? req.body.squeal['auto_seconds_delay']: null);

    autoSqueal.iteration_end = parseInt(autoSqueal.iteration_end);
    autoSqueal.next_scheduled_operation = parseInt(autoSqueal.next_scheduled_operation);


    let fromAdmin = (typeof req.query.fromAdmin !== 'undefined' ? req.query.fromAdmin: false);
    if(fromAdmin === 'true') fromAdmin = true;
    else fromAdmin = false;

    let ctrlOut = await squealController.postSqueal(squealDto, await authUser, autoSqueal, fromAdmin);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});

squealDriver.get('/', async function (req, res) {
    let authUser = authController.getAuthenticatedUser(req);

    let offset = (typeof req.query.offset !== 'undefined' ? req.query.offset : 0);
    let limit = (typeof req.query.limit !== 'undefined' ? req.query.limit : 10);
    let search_sender = (typeof req.query.search_sender !== 'undefined' ? req.query.search_sender : '');
    let search_dest = (typeof req.query.search_dest !== 'undefined' ? req.query.search_dest : '');
    let orderBy = (typeof req.query.orderBy !== 'undefined' ? req.query.orderBy : '');
    let orderDir = (typeof req.query.orderDir !== 'undefined' ? req.query.orderDir : '');
    authUser = await authUser;
    if(limit < 0) limit = 10;

    let ctrl = await squealController.getSquealList(authUser, offset, limit, search_sender, search_dest, orderBy, orderDir);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

squealDriver.put('/:id', async function(req, res) {
    let authUser = authController.getAuthenticatedUser(req);
    let id = req.params['id'];
    let newCords = (typeof req.body.squeal.new_position !== 'undefined' ? req.body.squeal.new_position: [0, 0]);
    if(Array.isArray(newCords) === false){
        newCords = [0,0];
    }
    if(newCords.length !== 2) {
        newCords = [0,0];
    }

    let ctrl = await squealController.updateAutoSqueal(await authUser, id, newCords);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

//DA AGGIUNGERE ALLA SPECIFICA SWAGGER
squealDriver.post('/from-smm/:username', async function(req, res){
    let authUser = await authController.getAuthenticatedUser(req);

    if (typeof req.body === 'undefined' || typeof req.body.squeal === 'undefined') {
        req.body = {};
        req.body.squeal = {};
        req.body.squeal.destinations = '';
        req.body.squeal.message_type = '';
        req.body.squeal.content = '';
        req.body.squeal.auto_iterations = '';
        req.body.squeal.auto_seconds_delay = '';
    }
    let squealDto = new SquealDto();
    let autoSqueal = new SquealTextAutoDto();
    squealDto._id = (typeof req.body.squeal['_id'] !== 'undefined' ? req.body.squeal['_id']: null);
    squealDto.destinations = (typeof req.body.squeal['destinations'] !== 'undefined' ? req.body.squeal['destinations']: null);
    squealDto.message_type = (typeof req.body.squeal['message_type'] !== 'undefined' ? req.body.squeal['message_type']: null);
    squealDto.content = (typeof req.body.squeal['content'] !== 'undefined' ? req.body.squeal['content']: null);
    autoSqueal.iteration_end = (typeof req.body.squeal['auto_iterations'] !== 'undefined' ? req.body.squeal['auto_iterations']: null);
    autoSqueal.next_scheduled_operation = (typeof req.body.squeal['auto_seconds_delay'] !== 'undefined' ? req.body.squeal['auto_seconds_delay']: null);
    autoSqueal.iteration_end = parseInt(autoSqueal.iteration_end);
    autoSqueal.next_scheduled_operation = parseInt(autoSqueal.next_scheduled_operation);

    let vipUsername = req.params.username;
    let ctrlOut = await squealController.postSquealFromSmm(squealDto, authUser, autoSqueal, vipUsername);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});

squealDriver.patch('/:id/reaction/:reactions', async function(req, res) {
    let authUser = authController.getAuthenticatedUser(req);
    let session_id = req.session.id;
    let requested_id = req.params['id'];
    let reaction = req.params['reactions'];

    let ctrlOut = await squealController.addSquealerReaction(requested_id, session_id, await authUser, reaction);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});

squealDriver.get('/:id/comment/', async function(req,res) {
    let authUser = authController.getAuthenticatedUser(req);
    let requested_id = parseInt(req.params['id']);

    let ctrlOut = await squealController.getSquealComments(await authUser, requested_id);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});

squealDriver.post('/:id/comment/', async function(req,res) {
    let authUser = authController.getAuthenticatedUser(req);
    let requested_id = parseInt(req.params['id']);
    let content = (typeof req.body['content'] !== 'undefined' ? req.body['content']: null);

    let ctrlOut = await squealController.postComment(await authUser, requested_id, content);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});

//Squeal - Admin only
squealDriver.put('/:id/destinations/', async function(req,res) {
    let authUser = authController.getAuthenticatedUser(req);
    let requested_id = parseInt(req.params['id']);
    let destinations = (typeof req.body['destinations'] !== 'undefined' ? req.body['destinations']: []);

    let ctrlOut = await squealController.changeDestinations(await authUser, requested_id, destinations);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});


squealDriver.put('/:id/reactions/', async function(req,res) {
    let authUser = authController.getAuthenticatedUser(req);
    let requested_id = parseInt(req.params['id']);
    let positive_value = (typeof req.body['positive_value'] !== 'undefined' ? parseInt(req.body['positive_value']): NaN);
    let negative_value = (typeof req.body['negative_value'] !== 'undefined' ? parseInt(req.body['negative_value']): NaN);

    let ctrlOut = await squealController.changeReactionValues(await authUser, requested_id, positive_value, negative_value);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});

module.exports = squealDriver;

