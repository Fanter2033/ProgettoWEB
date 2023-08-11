const express = require("express");
const userDriver = express();
const UserController = require("../controllers/UserController");
const UserModel = require("../models/UserModel");
const User = require("../entities/User");
let controller = new UserController(new UserModel('users'));

userDriver.get('/:username', async function (req, res) {
    let username = req.params['username'];
    let userObj = await controller.getUser(username);
    res.send(userObj);
});

module.exports = userDriver;
