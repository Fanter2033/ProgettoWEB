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

    let ctrlOut = await controller.createChannel(channelDto, await authUserPromise);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);

});

channelDriver.get('/', async function (req, res) {
    res.send('2');
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

channelDriver.get('/channel/:type/:channel/users/:username', async function(req, res){
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
