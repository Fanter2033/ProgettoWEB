const express = require("express");
const channelDriver = express();

const ChannelController = require("../controllers/ChannelController");
const ChannelModel = require("../models/ChannelModel");
const ChannelDto = require("../entities/dtos/ChannelDto");
const AuthController = require("../controllers/AuthController");
const AuthModel = require("../models/AuthModel");
let authController = new AuthController(new AuthModel());

let controller = new ChannelController(new ChannelModel());

channelDriver.use(express.json());
channelDriver.use(express.urlencoded({extended: true}));


channelDriver.post('/', async function (req, res) { //TODO TEST
    let authUserPromise = authController.getAuthenticatedUser(req);
    if (typeof req.body === 'undefined' || typeof req.body.channel === 'undefined') {
        req.body = {};
        req.body.channel = {};
        req.body.channel.name = '';
        req.body.channel.type = '';
        req.body.channel.private = true;
    }

    let channelDto = new ChannelDto();
    channelDto.type = (typeof req.body.channel['type'] !== 'undefined' ? req.body.channel['type']: null);
    channelDto.channel_name = (typeof req.body.channel['name'] !== 'undefined' ? req.body.channel['name']: null);
    channelDto.private = (typeof req.body.channel['private'] !== 'undefined' ? req.body.channel['private']: null);

    let ctrlOut = await controller.createChannel(channelDto, await authUserPromise);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);

});

channelDriver.get('/', async function (req, res) {
    let authUser = authController.getAuthenticatedUser(req);

    let offset = (typeof req.query.offset !== 'undefined' ? req.query.offset : 0);
    let limit = (typeof req.query.limit !== 'undefined' ? req.query.limit : 10);
    let search = (typeof req.query.search !== 'undefined' ? req.query.search : '');
    let orderBy = (typeof req.query.orderBy !== 'undefined' ? req.query.orderBy : '');
    let orderDir = (typeof req.query.orderDir !== 'undefined' ? req.query.orderDir : '');
    authUser = await authUser;

    let ctrl = await controller.getChannelList(authUser, offset, limit, search, orderBy, orderDir, null);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

channelDriver.get('/:type', async function (req, res) {
    let authUser = authController.getAuthenticatedUser(req);

    let type = (typeof req.params['type'] !== 'undefined' ? req.params['type']: null);
    let offset = (typeof req.query.offset !== 'undefined' ? req.query.offset : 0);
    let limit = (typeof req.query.limit !== 'undefined' ? req.query.limit : 10);
    let search = (typeof req.query.search !== 'undefined' ? req.query.search : '');
    let orderBy = (typeof req.query.orderBy !== 'undefined' ? req.query.orderBy : '');
    let orderDir = (typeof req.query.orderDir !== 'undefined' ? req.query.orderDir : '');
    authUser = await authUser;

    let ctrl = await controller.getChannelList(authUser, offset, limit, search, orderBy, orderDir, type);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

channelDriver.put('/:type/:channel', async function (req, res) {
    res.send('3');
});

channelDriver.delete('/:type/:channel', async function (req, res) {
    let channelDto = new ChannelDto();
    channelDto.type = (typeof req.params['type'] !== 'undefined' ? req.params['type']: null);
    channelDto.channel_name = (typeof req.params['channel'] !== 'undefined' ? req.params['channel']: null);

    let authUserPromise = authController.getAuthenticatedUser(req);
    let ctrlOut = await controller.deleteChannel(channelDto, await authUserPromise);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});

channelDriver.get('/:type/:channel', async function (req, res) { //TODO TEST
    let channelDto = new ChannelDto();
    channelDto.type = (typeof req.params['type'] !== 'undefined' ? req.params['type']: null);
    channelDto.channel_name = (typeof req.params['channel'] !== 'undefined' ? req.params['channel']: null);

    let ctrlOut = await controller.getChannel(channelDto);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});

channelDriver.patch('/:type/:channel/:username', async function(req, res){ //TODO IMPLEMENT
    res.send('6');
});

channelDriver.get('/:type/:channel/users', async function(req, res){ //TODO IMPLEMENT
    res.send('7');
});

channelDriver.get('/:type/:channel/users/:username', async function(req, res){
    let channelDto = new ChannelDto();
    channelDto.type = (typeof req.params['type'] !== 'undefined' ? req.params['type']: null);
    channelDto.channel_name = (typeof req.params['channel'] !== 'undefined' ? req.params['channel']: null);
    let username = (typeof req.params['username'] !== 'undefined' ? req.params['username']: null);

    let ctrlOut = await controller.getChannelUserRole(channelDto, username);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});


module.exports = channelDriver;
