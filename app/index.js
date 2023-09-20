const express = require('express');
const autoload = require('./autoload/autoload');
const backEndRouter = express();
const databaseDriver = require('./drivers/databaseDriver');
const authDriver = require('./drivers/authDriver.js')
const userDriver = require('./drivers/userDriver');
const viewDriver = require('./drivers/views/viewDriver');

global.rootDir = __dirname;
global.startDate = null;
global.autoload = autoload;

backEndRouter.use('/js', express.static(global.rootDir + '/public/js'));
backEndRouter.use('/css', express.static(global.rootDir + '/public/css'));
backEndRouter.use('/data', express.static(global.rootDir + '/public/data'));
backEndRouter.use('/docs', express.static(global.rootDir + '/public/html'));
backEndRouter.use('/img', express.static(global.rootDir + '/public/media'));

backEndRouter.get('/', );

backEndRouter.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/html/home.html');
});

//If a request starts with /database is sent to database driver!
backEndRouter.use('/database', databaseDriver);
backEndRouter.use('/auth', authDriver);
backEndRouter.use('/user', userDriver);
backEndRouter.use('/', viewDriver);

backEndRouter.listen(autoload.config._WEBSERVER_PORT, () => {
    console.log(`Server started on port ${autoload.config._WEBSERVER_PORT}`);
});