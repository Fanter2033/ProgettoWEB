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
    res.render(publicDir + "/html/admins/dashboard.html", {username: req.session.user.username});
});

module.exports = viewAdminDriver;

