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
        res.redirect('./home');
        return;
    }
    const path = require("path")
    //serve the static files from react
    const reactDir = path.join(__dirname, '../../react-squealer/build');
    viewDriver.use(express.static(reactDir));
    res.sendFile(path.join(reactDir, '/index.html'));
});

//view di smm
viewDriver.get('/smmView*', (req, res) => {
    if(authController.isAuthLogged(req) === false && req.path !== '/smmView/'){
        res.redirect('/smmView/');
        return
    }
    if(authController.isAuthLogged(req) && req.path === '/smmView/'){
        res.redirect('./dashboard');
        return
    }

    const path = require("path");
    const vueDir = path.join(__dirname, '../../vue-squealer/Development/SMM/dist');
    viewDriver.use(express.static(vueDir));
    res.sendFile(path.join(vueDir, '/index.html'));
});

viewDriver.use('/admin', viewAdminDriver);

module.exports = viewDriver;