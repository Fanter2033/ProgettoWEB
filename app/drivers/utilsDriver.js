const express = require("express");
const AuthController = require("../controllers/AuthController");
const AuthModel = require("../models/AuthModel");
const UtilsController = require("../controllers/UtilsController");
const ChannelDto = require("../entities/dtos/ChannelDto");

const utilsDriver = express.Router({ mergeParams: true });
let controller = new UtilsController();
let authController = new AuthController(new AuthModel());

utilsDriver.get("/chat", async function (req, res) {
    let authenticatedUser = authController.getAuthenticatedUser(req);
    let excludeFrom = (typeof req.query.excludeFrom !== 'undefined' ? parseInt(req.query.excludeFrom) : 0);
    let excludeTo = (typeof req.query.excludeTo !== 'undefined' ? parseInt(req.query.excludeTo) : 0);
    if(isNaN(excludeFrom))
        excludeFrom = 0;
    if(isNaN(excludeTo))
        excludeTo = 0;
    authenticatedUser = await authenticatedUser;
    let session_id = req.session.id;
    let ctrlOut = await controller.getSquealsToUser(authenticatedUser, excludeFrom, excludeTo, session_id);
    if (ctrlOut.code === 200) res.status(ctrlOut.code).send(ctrlOut.content);
    else res.status(ctrlOut.code).send(ctrlOut);
});

utilsDriver.get("/dashboard", async function (req, res) {
    let authenticatedUser = authController.getAuthenticatedUser(req);
    let excludeFrom = (typeof req.query.excludeFrom !== 'undefined' ? parseInt(req.query.excludeFrom) : 0);
    let excludeTo = (typeof req.query.excludeTo !== 'undefined' ? parseInt(req.query.excludeTo) : 0);
    if(isNaN(excludeFrom))
        excludeFrom = 0;
    if(isNaN(excludeTo))
        excludeTo = 0;
    authenticatedUser = await authenticatedUser;
    let session_id = req.session.id;
    let ctrlOut = await controller.getSquealsToChannelsOfUser(authenticatedUser, excludeFrom, excludeTo, session_id);
    if (ctrlOut.code === 200) res.status(ctrlOut.code).send(ctrlOut.content);
    else res.status(ctrlOut.code).send(ctrlOut);
});

utilsDriver.get("/squeals/:username", async function(req, res) {
    let username = (typeof req.params.username !== 'undefined' ? req.params.username.trim() : "");
    let ctrlOut = await controller.getSentSquealsFromUser(username);
    if (ctrlOut.code === 200) res.status(200).send(ctrlOut.content);
    else res.status(ctrlOut.code).send(ctrlOut);
});

utilsDriver.get('/squeals/:type/:name', async function (req, res) {
    let authUser = authController.getAuthenticatedUser(req);
    let channelDto = new ChannelDto();
    channelDto.type = (typeof req.params['type'] !== 'undefined' ? req.params['type']: null);
    channelDto.channel_name = (typeof req.params['name'] !== 'undefined' ? req.params['name']: null);
    authUser = await authUser;
    let ctrlOut = await controller.getSentSquealsToChannels(authUser, channelDto);
    if (ctrlOut.code === 200) res.status(200).send(ctrlOut.content);
    else res.status(ctrlOut.code).send(ctrlOut);
});

module.exports = utilsDriver;
