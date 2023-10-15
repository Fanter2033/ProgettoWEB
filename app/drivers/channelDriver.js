const express = require("express");
const channelDriver = express();

channelDriver.use(express.json());
channelDriver.use(express.urlencoded({extended: true}));
channelDriver.post('/', async function (req, res) {

});

channelDriver.get('/', async function (req, res) {

});

channelDriver.put('/:channel', async function (req, res) {

});

channelDriver.delete('/:channel', async function (req, res) {

});

channelDriver.get('/:channel', async function (req, res) {

});


module.exports = channelDriver;
