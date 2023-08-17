const express = require("express");
const viewDriver = express();

const path = require("path")
const publicDir = path.join(__dirname, '../../public');
viewDriver.use(express.static(publicDir));

viewDriver.get('/', function (req, res){
    res.sendFile(publicDir + "/html/login.html");
});

module.exports = viewDriver;
