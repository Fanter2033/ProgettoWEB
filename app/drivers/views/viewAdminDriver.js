const express = require("express");
const viewAdminDriver = express();
const path = require("path")
const publicDir = path.join(__dirname, '../../public');
viewAdminDriver.use(express.static(publicDir));

viewAdminDriver.get('/', function (req, res){
    if(req.session.user) {
        res.send('AUTH_LOGGED');
        //TODO REMOVE SESSION DESTROY
        //req.session.destroy();
    } else
        res.sendFile(publicDir + "/html/admins/login.html");
});

module.exports = viewAdminDriver;

