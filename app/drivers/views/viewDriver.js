const express = require("express");
const viewDriver = express();

const path = require("path")
const publicDir = path.join(__dirname, '../../public');
viewDriver.use(express.static(publicDir));

viewDriver.get('/', function (req, res) {
    res.sendFile(publicDir + "/html/deMultiplexPage.html");
});

viewDriver.get('/loginUser', function (req, res){
    res.send('HELLO! Cambiare qui (1)');
});

viewDriver.get('/loginSMM', function (req, res){
    res.send('HELLO! Cambiare qui (2)');
});

viewDriver.get('/loginAdmin', function (req, res){
    res.sendFile(publicDir + "/html/loginAdmin.html");
});

module.exports = viewDriver;
