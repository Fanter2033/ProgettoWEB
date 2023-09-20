const express = require("express");
const authDriver = express();
const AuthController = require("../controllers/AuthController");
const AuthModel = require("../models/AuthModel");
const User = require("../entities/User");
let controller = new AuthController(new AuthModel('users'));

authDriver.use(express.json());
authDriver.use(express.urlencoded({extended: true}));

authDriver.post('/:username', async function (req, res) {
    if (typeof req.body === 'undefined') {
        req.body = {};
    }
    let username = req.params['username'];
    let password = (typeof req.body.password !== 'undefined' ? req.body.password : '');
    let ctrl = await controller.authenticateUser(username, password);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

module.exports = authDriver;
