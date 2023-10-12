const express = require("express");
const channelDriver = express();

channelDriver.use(express.json());
channelDriver.use(express.urlencoded({extended: true}));
channelDriver.post('/', async function (req, res) {
    res.send(1);
});

channelDriver.get('/', async function (req, res) {
    res.send(5);
});

channelDriver.put('/:channel', async function (req, res) {
    res.send(2);
});

channelDriver.delete('/:channel', async function (req, res) {
    res.send(3);
});

channelDriver.get('/:channel', async function (req, res) {
    res.send(4);
});


module.exports = channelDriver;
