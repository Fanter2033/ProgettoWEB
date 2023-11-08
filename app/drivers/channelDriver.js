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


channelDriver.post('/', async function (req, res) {
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

    authUserPromise = await authUserPromise;
    let ctrlOut = await controller.createChannel(channelDto, authUserPromise);
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
    let channelDto = new ChannelDto();
    let authUserPromise = authController.getAuthenticatedUser(req);
    let newChannel = new ChannelDto();

    if (typeof req.body === 'undefined' || typeof req.body.channel === 'undefined') {
        req.body = {};
        req.body.channel = {};
        req.body.channel.name = '';
        req.body.channel.type = '';
        req.body.channel.private = true;
    }

    channelDto.type = (typeof req.params['type'] !== 'undefined' ? req.params['type']: null);
    channelDto.channel_name = (typeof req.params['channel'] !== 'undefined' ? req.params['channel']: null);
    newChannel.type = (typeof req.body.channel['type'] !== 'undefined' ? req.body.channel['type']: null);
    newChannel.channel_name = (typeof req.body.channel['name'] !== 'undefined' ? req.body.channel['name']: null);
    newChannel.private = (typeof req.body.channel['private'] !== 'undefined' ? req.body.channel['private']: null);

    let ctrlOut = await controller.updateChannel(channelDto, newChannel, await authUserPromise);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
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

channelDriver.get('/:type/:channel', async function (req, res) {
    let channelDto = new ChannelDto();
    channelDto.type = (typeof req.params['type'] !== 'undefined' ? req.params['type']: null);
    channelDto.channel_name = (typeof req.params['channel'] !== 'undefined' ? req.params['channel']: null);

    let ctrlOut = await controller.getChannel(channelDto);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});

channelDriver.patch('/:type/:channel/:username', async function(req, res){
    let channelDto = new ChannelDto();
    let authUserPromise = authController.getAuthenticatedUser(req);

    if (typeof req.body === 'undefined' || typeof req.body.new_role === 'undefined') {
        req.body = {};
        req.body.new_role = -1;
    }

    channelDto.type = (typeof req.params['type'] !== 'undefined' ? req.params['type']: null);
    channelDto.channel_name = (typeof req.params['channel'] !== 'undefined' ? req.params['channel']: null);
    let username = (typeof req.params['username'] !== 'undefined' ? req.params['username']: null);
    let new_role = (typeof req.body.new_role !== 'undefined' ? req.body.new_role: null);
    new_role = parseInt(new_role);

    let ctrlOut = await controller.changeChannelRole(channelDto, username, new_role, await authUserPromise);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});

channelDriver.patch('/:type/:channel/toggle/lock', async function(req, res){
    let channelDto = new ChannelDto();
    let authUserPromise = authController.getAuthenticatedUser(req);

    channelDto.type = (typeof req.params['type'] !== 'undefined' ? req.params['type']: null);
    channelDto.channel_name = (typeof req.params['channel'] !== 'undefined' ? req.params['channel']: null);

    let ctrlOut = await controller.toggleChannelLock(channelDto, await authUserPromise);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});

channelDriver.get('/:type/:channel/users', async function(req, res){
    let channelDto = new ChannelDto();
    channelDto.type = (typeof req.params['type'] !== 'undefined' ? req.params['type']: null);
    channelDto.channel_name = (typeof req.params['channel'] !== 'undefined' ? req.params['channel']: null);

    let ctrlOut = await controller.getChannelSubscribers(channelDto);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
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

channelDriver.get('/:type/:channel/roles/:role', async function(req, res){
    let channelDto = new ChannelDto();
    channelDto.type = (typeof req.params['type'] !== 'undefined' ? req.params['type']: null);
    channelDto.channel_name = (typeof req.params['channel'] !== 'undefined' ? req.params['channel']: null);
    let role = (typeof req.params['role'] !== 'undefined' ? req.params['role']: null);
    role = parseInt(role);

    let ctrlOut = await controller.getChannelSubscribers(channelDto, role);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});


module.exports = channelDriver;
