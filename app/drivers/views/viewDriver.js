const express = require("express");
const viewDriver = express();
const path = require("path");
const publicDir = path.join(__dirname, '../../public');
viewDriver.use(express.static(publicDir));
const viewAdminDriver = require('./viewAdminDriver');
const reactDriver = require('./reactDriver');

viewDriver.get('/', (req, res) => {
    res.sendFile(publicDir + "/html/deMultiplexPage.html");
});

//view di react
viewDriver.use('/userView', reactDriver);

//view di smm
viewDriver.get('/smm/', (req, res) => {
    res.send('HELLO! Cambiare qui (2)');
});

//view di admin
viewDriver.use('/admin', viewAdminDriver);

module.exports = viewDriver;

