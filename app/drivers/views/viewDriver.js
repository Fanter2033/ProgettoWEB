const express = require("express");
const viewDriver = express();
const path = require("path");
const publicDir = path.join(__dirname, '../../public');
viewDriver.use(express.static(publicDir));
const viewAdminDriver = require('./viewAdminDriver');

viewDriver.get('/', (req, res) => {
    res.sendFile(publicDir + "/html/deMultiplexPage.html");
});

//view di react
viewDriver.get('/userView*', (req, res) => {
    const path = require("path")
    //serve the static files from react
    const reactDir = path.join(__dirname, '../../react-squealer/build');
    viewDriver.use(express.static(reactDir));
    res.sendFile(path.join(reactDir, '/index.html'));
});

//view di smm
viewDriver.get('/smm/', (req, res) => {
    res.send('HELLO! Cambiare qui (2)');
});

viewDriver.use('/admin', viewAdminDriver);

module.exports = viewDriver;

