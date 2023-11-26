const express = require("express");
const viewDriver = express();
const path = require("path");
const publicDir = path.join(__dirname, '../../public');
viewDriver.use(express.static(publicDir));
const viewAdminDriver = require('./viewAdminDriver');
const AuthController = require('../../controllers/AuthController');
const AuthModel = require('../../models/AuthModel');
let authController = new AuthController(new AuthModel());

viewDriver.get('/', (req, res) => {
    res.sendFile(publicDir + "/html/deMultiplexPage.html");
});

viewDriver.get('/userView*', async (req, res) => {
    if(authController.isAuthLogged(req) === false && req.path !== '/userView/'){
        res.redirect('/userView/');
        return;
    }
    if(authController.isAuthLogged(req) && req.path === '/userView/'){
        res.redirect('./');
        return;
    }
    const path = require("path")
    //serve the static files from react
    const reactDir = path.join(__dirname, '../../react-squealer/build');
    viewDriver.use(express.static(reactDir));
    res.sendFile(path.join(reactDir, '/index.html'));
});

//view di smm
viewDriver.get('/smm/', (req, res) => {
    res.send('../../vue-squealer/Development/SMM/index.html');
});

viewDriver.use('/admin', viewAdminDriver);

module.exports = viewDriver;