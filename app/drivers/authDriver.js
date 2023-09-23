const express = require("express");
const authDriver = express();
const AuthController = require("../controllers/AuthController");
const AuthModel = require("../models/AuthModel");
const {_AUTH_ATTEMPTS_COLLECTION} = require("../config/squealer");
let controller = new AuthController(new AuthModel(_AUTH_ATTEMPTS_COLLECTION));

authDriver.use(express.json());
authDriver.use(express.urlencoded({extended: true}));

authDriver.post('/:username/:auth_field', async function (req, res) {
    if (typeof req.body === 'undefined') {
        req.body = {};
    }
    let username = req.params['username'];
    let auth_field = req.params['auth_field'];
    let password = (typeof req.body.password !== 'undefined' ? req.body.password : '');
    controller.setInvokerIp(req.socket.remoteAddress);
    let ctrl = await controller.authenticateUser(req, res, username, password, auth_field);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

module.exports = authDriver;
