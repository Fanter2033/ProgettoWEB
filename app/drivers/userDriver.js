const express = require("express");
const userDriver = express();
const UserController = require("../controllers/UserController");
const UserModel = require("../models/UserModel");
let controller = new UserController(new UserModel('users'));

userDriver.get('/:username', async function (req, res) {
    let username = req.params['username'];
    let ctrl = await controller.getUser(username);
    if(ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

userDriver.delete('/:username', async function (req, res) {
    let username = req.params['username'];
    let ctrl = await controller.deleteUser(username);
    if(ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

module.exports = userDriver;
