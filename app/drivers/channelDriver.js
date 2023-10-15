const express = require("express");
const channelDriver = express();

const ChannelController = require("../controllers/ChannelController");
const ChannelModel = require("../models/ChannelModel");
let controller = new ChannelController(new ChannelModel());

channelDriver.use(express.json());
channelDriver.use(express.urlencoded({extended: true}));
channelDriver.post('/', async function (req, res) {
    res.send('1');
});

channelDriver.get('/', async function (req, res) {
    res.send('2');
});

channelDriver.put('/:channel', async function (req, res) {
    res.send('3');
});

channelDriver.delete('/:channel', async function (req, res) {
    res.send('4');
});

channelDriver.get('/:channel', async function (req, res) {
    let ctrlOut = await controller.getChannel(req.params['channel']);
    if (ctrlOut.code === 200)
        res.status(ctrlOut.code).send(ctrlOut.content);
    else
        res.status(ctrlOut.code).send(ctrlOut);
});


module.exports = channelDriver;
