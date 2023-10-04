const express = require("express");
const viewAdminDriver = express();
const path = require("path")
const AuthController = require("../../controllers/AuthController");
const AuthModel = require("../../models/AuthModel");
const publicDir = path.join(__dirname, '../../public');
viewAdminDriver.use(express.static(publicDir));
const authController = new AuthController(new AuthModel());


viewAdminDriver.engine('html', require('ejs').renderFile);

viewAdminDriver.get('/', function (req, res){
    let logged = authController.isAuthLogged(req);
    if(logged) {
        res.redirect('./dashboard');
    } else
        res.sendFile(publicDir + "/html/admins/login.html");
});

viewAdminDriver.get('/dashboard', async function (req, res) {
    let authAdmin = await authController.isAuthAdmin(req);
    if (authAdmin === false) {
        res.redirect('./');
        return;
    }
    //If we are here, we can send the page, cause them are an admin!
    //IF NO IMAGE
    let random = authController.getRandomInt(3);
    let iconUri = '';
    switch (random){
        case 0:
            iconUri = '../../media/icons/man.png';
            break;
        case 1:
            iconUri = '../../media/icons/woman.png';
            break;
        default:
            iconUri = '../../media/icons/not-binary.png';
            break;
    }
    res.render(publicDir + "/html/admins/dashboard.html", {username: req.session.user.username, icon_uri: iconUri});
});

viewAdminDriver.get('/users', async function (req, res) {
    let authAdmin = await authController.isAuthAdmin(req);
    if (authAdmin === false) {
        res.redirect('./');
        return;
    }
    //If we are here, we can send the page, cause them are an admin!
    //IF NO IMAGE
    let random = authController.getRandomInt(3);
    let iconUri = '';
    switch (random){
        case 0:
            iconUri = '../../media/icons/man.png';
            break;
        case 1:
            iconUri = '../../media/icons/woman.png';
            break;
        default:
            iconUri = '../../media/icons/not-binary.png';
            break;
    }
    res.render(publicDir + "/html/admins/user.html", {username: req.session.user.username, icon_uri: iconUri});
});

module.exports = viewAdminDriver;

