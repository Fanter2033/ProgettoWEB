const express = require("express");
const authDriver = express();
const AuthController = require("../controllers/AuthController");
const AuthModel = require("../models/AuthModel");
const {_AUTH_ATTEMPTS_COLLECTION} = require("../config/squealer");
let authController = new AuthController(new AuthModel(_AUTH_ATTEMPTS_COLLECTION));

authDriver.use(express.json());
authDriver.use(express.urlencoded({extended: true}));

/**
 * method: POST
 * route: /username/auth_field
 */
authDriver.post('/:username/:auth_field', async function (req, res) {
    if (typeof req.body === 'undefined') {
        req.body = {};
    }
    let username = req.params['username'];
    let auth_field = req.params['auth_field'];
    let password = (typeof req.body.password !== 'undefined' ? req.body.password : '');
    authController.setInvokerIp(req.socket.remoteAddress);
    let AuthCtrl = await authController.authenticateUser(req, res, username, password, auth_field);
    if (AuthCtrl.code === 204)
        res.status(AuthCtrl.code).send(AuthCtrl.content);
    else
        res.status(AuthCtrl.code).send(AuthCtrl);
});

/**
 * method: POST
 * route: /logout
 */
authDriver.post('/logout', async function(req, res){
    let ctrlOutput = authController.deAuthenticateUser(req);
    if (ctrlOutput.code === 204)
        res.status(ctrlOutput.code).send(ctrlOutput.content);
    else
        res.status(ctrlOutput.code).send(ctrlOutput);
});

module.exports = authDriver;
