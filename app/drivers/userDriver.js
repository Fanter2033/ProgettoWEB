const express = require("express");
const userDriver = express();
const UserController = require("../controllers/UserController");
const UserModel = require("../models/UserModel");
const UserDto = require("../entities/dtos/UserDto");
const quoteDriver = require('./quoteDriver');
let controller = new UserController(new UserModel('users'));
const AuthController = require("../controllers/AuthController");
const AuthModel = require("../models/AuthModel");
let authController = new AuthController(new AuthModel());

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
    let ctrl = await controller.deleteUser(username, await authController.getAuthenticatedUser(req));
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

userDriver.post('/', async function (req, res) {
    let authUser = authController.getAuthenticatedUser(req);
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
    let isUser = (typeof req.body.user.isUser !== 'undefined' ? req.body.user.isUser : null);
    let isSmm = (typeof req.body.user.isSmm !== 'undefined' ? req.body.user.isSmm : null);
    let vip = (typeof req.body.user.vip !== 'undefined' ? req.body.user.vip : false);
    let isMod = (typeof req.body.user.isMod !== 'undefined' ? req.body.user.isMod : null);
    let reset = (typeof req.body.user.reset !== 'undefined' ? req.body.user.reset : null);

    let user = new UserDto();
    user.username = username
    user.email = email;
    user.first_name = firstname
    user.last_name = lastname;
    user.psw_shadow = password;
    user.isUser = isUser;
    user.vip = vip;
    user.isSmm = isSmm;
    user.isAdmin = isMod;
    user.reset = reset;
    let ctrl = await controller.createUser(user, await authUser);
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
    let isUser = (typeof req.body.user.isUser !== 'undefined' ? req.body.user.isUser : null);
    let isSmm = (typeof req.body.user.isSmm !== 'undefined' ? req.body.user.isSmm : null);
    let isMod = (typeof req.body.user.isMod !== 'undefined' ? req.body.user.isMod : null);
    let vip = (typeof req.body.user.vip !== 'undefined' ? req.body.user.vip : null);
    let pfp = (typeof req.body.user.pfp !== 'undefined' ? req.body.user.pfp : null);

    let username_old = req.params['username'];

    let user = new UserDto();
    user.username = username
    user.email = email;
    user.first_name = firstname
    user.last_name = lastname;
    user.psw_shadow = password;
    user.isUser = isUser;
    user.isSmm = isSmm;
    user.isAdmin = isMod;
    user.pfp = pfp;
    user.vip = vip;
    let ctrl = await controller.updateUser(user, username_old, await authController.getAuthenticatedUser(req));
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
    if(limit < 0) limit = 10;

    let ctrl = await controller.getUserList(authUser, offset, limit, search, orderBy, orderDir);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

userDriver.get('/type/:filter', async function (req, res) {
    let authUser = authController.getAuthenticatedUser(req);

    let offset = (typeof req.query.offset !== 'undefined' ? req.query.offset : 0);
    let limit = (typeof req.query.limit !== 'undefined' ? req.query.limit : 10);
    let search = (typeof req.query.search !== 'undefined' ? req.query.search : '');
    let orderBy = (typeof req.query.orderBy !== 'undefined' ? req.query.orderBy : '');
    let orderDir = (typeof req.query.orderDir !== 'undefined' ? req.query.orderDir : '');
    let filter = req.params['filter'];
    authUser = await authUser;
    if(limit < 0) limit = 10;

    let ctrl = await controller.getUserList(authUser, offset, limit, search, orderBy, orderDir, filter);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

userDriver.patch('/:username/toggle/lock', async function (req, res) {
    let username = req.params['username'];
    let ctrl = await controller.toggleLock(username, await authController.getAuthenticatedUser(req));
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

userDriver.use(`/:username/quote`, quoteDriver);

userDriver.get(`/:username/stats/squealPopularity`, async function (req, res) {
    let username = req.params['username'];

    let fromTimestamp = (typeof req.query.fromTimestamp !== 'undefined' ? parseInt(req.query.fromTimestamp) : 0);
    let toTimestamp = (typeof req.query.toTimestamp !== 'undefined' ? parseInt(req.query.toTimestamp) : 0);

    let ctrl = await controller.getPopularityStats(username, fromTimestamp, toTimestamp);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

userDriver.get(`/:username/roles`, async function (req, res) {
    let username = req.params['username'];

    let ctrl = await controller.getUserRoles(username);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

userDriver.put('/:username/resetPassword', async function (req, res) {
    let username = req.params['username'];
    let reset = (typeof req.body.reset !== 'undefined' ? (req.body.reset) : '');
    let password = (typeof req.body.password !== 'undefined' ? (req.body.password) : '');

    let ctrl = await controller.resetPasswd(username, reset, password);
    if (ctrl.code === 200)
        res.status(ctrl.code).send(ctrl.content);
    else
        res.status(ctrl.code).send(ctrl);
});

// ---------------- SOTTO FUNZIONI DI SAMI, SOPRA QUELLE DI ROMANELLA --------------------------

userDriver.patch("/:username/toggle/vip", async function(req, res){
    let username = req.params['username'];
    let ctrl = await controller.toggleVip(username, await authController.getAuthenticatedUser(req));
    if(ctrl['code'] === 200)
        res.status(ctrl['code']).send(ctrl['content']);
    else
        res.status(ctrl['code']).send(ctrl);
});

userDriver.patch("/:username/toggle/smm", async function(req, res){
    let ctrl = await controller.toggleSmm(await authController.getAuthenticatedUser(req));
    if(ctrl['code'] === 200)
        res.status(ctrl['code']).send(ctrl['content']);
    else
        res.status(ctrl['code']).send(ctrl);
});

userDriver.patch("/:username/pick-smm/:smm", async  function(req, res){
    let ctrl = await controller.pickSmm(
        req.params['smm'],
        await authController.getAuthenticatedUser(req));

    if(ctrl['code'] === 200)
        res.status(ctrl['code']).send(ctrl['content']);
    else
        res.status(ctrl['code']).send(ctrl);

})

userDriver.patch("/:username/remove-smm", async function(req, res){
  let ctrl = await controller.removeSmm(
      await authController.getAuthenticatedUser(req)
  );

  if(ctrl['code'] === 200)
      res.status(ctrl['code']).send(ctrl['content']);
  else
      res.status(ctrl['code']).send(ctrl);
})

userDriver.get("/:username/my-smm", async function(req, res){
    let ctrl = await controller.getSmm(req.params['username']);

    if(ctrl['code'] === 200)
        res.status(ctrl['code']).send(ctrl['content']);
    else
        res.status(ctrl['code']).send(ctrl);
})


userDriver.get("/:username/my-users/", async function(req, res){
    let ctrl = await controller.getLinkedUsers(req.params['username']);

    if(ctrl['code'] === 200)
        res.status(ctrl['code']).send(ctrl['content']);
    else
        res.status(ctrl['code']).send(ctrl);
});



module.exports = userDriver;