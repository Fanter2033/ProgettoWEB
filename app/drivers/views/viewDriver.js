const express = require("express");
const viewDriver = express();
const path = require("path")
const publicDir = path.join(__dirname, '../../public');
viewDriver.use(express.static(publicDir));

viewDriver.get('/', function (req, res) {
    res.sendFile(publicDir + "/html/deMultiplexPage.html");
});


viewDriver.get('/userView', function (req, res){
    const path = require("path")
    const reactDir = path.join(__dirname, '../../react-squealer/build');
    viewDriver.use(express.static(reactDir));
    res.sendFile(path.join(reactDir, '/index.html'));
});

viewDriver.get('/smm/', function (req, res){
    res.send('HELLO! Cambiare qui (2)');
});

viewDriver.get('/admin/', function (req, res){
    res.sendFile(publicDir + "/html/loginAdmin.html");
});

module.exports = viewDriver;

