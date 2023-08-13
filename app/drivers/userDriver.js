const express = require("express");
const userDriver = express();
const UserController = require("../controllers/UserController");
const UserModel = require("../models/UserModel");
const User = require("../entities/User");
let controller = new UserController(new UserModel('users'));

userDriver.use(express.json());
userDriver.use(express.urlencoded({extended: true}));
userDriver.get('/:username', async function (req, res) {
    let username = req.params['username'];
    let ctrl = await controller.getUser(username);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

userDriver.delete('/:username', async function (req, res) {
    let username = req.params['username'];
    let ctrl = await controller.deleteUser(username);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

userDriver.post('/', async function (req, res) {
    if (typeof req.body === 'undefined' || typeof req.body.user === 'undefined') {
        req.body = {};
        req.body.user = {};
        req.body.user.username = '';
        req.body.user.email = '';
        req.body.user.firstname = '';
        req.body.user.lastname = '';
        req.body.user.password = '';
    }

    let username = (typeof req.body.user.username !== 'undefined' ? req.body.user.username : '');
    let email = (typeof req.body.user.email !== 'undefined' ? req.body.user.email : '');
    let firstname = (typeof req.body.user.firstname !== 'undefined' ? req.body.user.firstname : '');
    let lastname = (typeof req.body.user.lastname !== 'undefined' ? req.body.user.lastname : '');
    let password = (typeof req.body.user.password !== 'undefined' ? req.body.user.password : '');

    let user = new User(username, email, firstname, lastname, password, 0);
    let ctrl = await controller.createUser(user);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);

});

userDriver.put('/:username', async function (req, res) {
    if (typeof req.body === 'undefined' || typeof req.body.user === 'undefined') {
        req.body = {};
        req.body.user = {};
        req.body.user.username = '';
        req.body.user.email = '';
        req.body.user.firstname = '';
        req.body.user.lastname = '';
        req.body.user.password = '';
    }

    let username = (typeof req.body.user.username !== 'undefined' ? req.body.user.username : '');
    let email = (typeof req.body.user.email !== 'undefined' ? req.body.user.email : '');
    let firstname = (typeof req.body.user.firstname !== 'undefined' ? req.body.user.firstname : '');
    let lastname = (typeof req.body.user.lastname !== 'undefined' ? req.body.user.lastname : '');
    let password = (typeof req.body.user.password !== 'undefined' ? req.body.user.password : '');
    let username_old = req.params['username'];

    let user = new User(username, email, firstname, lastname, password, 0);
    let ctrl = await controller.updateUser(user, username_old);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

module.exports = userDriver;
