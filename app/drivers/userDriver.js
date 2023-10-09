const express = require("express");
const userDriver = express();
const UserController = require("../controllers/UserController");
const UserModel = require("../models/UserModel");
const UserDto = require("../entities/dtos/UserDto");
let controller = new UserController(new UserModel('users'));
const AuthController = require("../controllers/AuthController");
const AuthModel = require("../models/AuthModel");
let authController = new AuthController(new AuthModel());

userDriver.use(express.json());
userDriver.use(express.urlencoded({extended: true}));
userDriver.get('/:username', async function (req, res) {
    let authUser = authController.getAuthenticatedUser(req);
    let username = req.params['username'];
    let ctrl = await controller.getUserAuth(username, await authUser);
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

    let user = new UserDto();
    user.username = username
    user.email = email;
    user.first_name = firstname
    user.last_name = lastname;
    user.psw_shadow = password;
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

    let user = new UserDto();
    user.username = username
    user.email = email;
    user.first_name = firstname
    user.last_name = lastname;
    user.psw_shadow = password;
    let ctrl = await controller.updateUser(user, username_old);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

userDriver.get('/', async function (req, res) {
    let authUser = authController.getAuthenticatedUser(req);

    let offset = (typeof req.query.offset !== 'undefined' ? req.query.offset : 0);
    let limit = (typeof req.query.limit !== 'undefined' ? req.query.limit : 10);
    let search = (typeof req.query.search !== 'undefined' ? req.query.search : '');
    let orderBy = (typeof req.query.orderBy !== 'undefined' ? req.query.orderBy : '');
    let orderDir = (typeof req.query.orderDir !== 'undefined' ? req.query.orderDir : '');
    authUser = await authUser;

    let ctrl = await controller.getUserList(authUser, offset, limit, search, orderBy, orderDir);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});


module.exports = userDriver;
