const express = require("express");
const channelDriver = express();

const ChannelController = require("../controllers/ChannelController");
const ChannelModel = require("../models/ChannelModel");
const ChannelDto = require("../entities/dtos/ChannelDto");

let controller = new ChannelController(new ChannelModel());

channelDriver.use(express.json());
channelDriver.use(express.urlencoded({extended: true}));
channelDriver.post('/', async function (req, res) {
    res.send('1');
});

channelDriver.get('/', async function (req, res) {
    res.send('2');
});

channelDriver.put('/:type/:channel', async function (req, res) {
    res.send('3');
});

channelDriver.delete('/:type/:channel', async function (req, res) {
    res.send('4');
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


module.exports = channelDriver;
