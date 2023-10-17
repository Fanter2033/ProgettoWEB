const express = require('express');
const autoload = require('./autoload/autoload');
const backEndRouter = express();
const databaseDriver = require('./drivers/databaseDriver');
const authDriver = require('./drivers/authDriver.js')
const userDriver = require('./drivers/userDriver');
const channelDriver = require('./drivers/channelDriver');
const viewDriver = require('./drivers/views/viewDriver');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const cors = require('cors')

global.rootDir = __dirname;
global.startDate = null;
global.autoload = autoload;

const oneDay = 1000 * 60 * 60 * 24;

/*
* save and crypt sessions
* */
backEndRouter.use(session({
    secret: autoload.config._SESSION_SECRET,
    store: MongoStore.create({
        mongoUrl: `mongodb://${autoload.config._DATABASE_USER}:${autoload.config._DATABASE_PWD}@${autoload.config._DATABASE_HOST}:${autoload.config._DATABASE_PORT}/${autoload.config._DATABASE_NAME}${autoload.config._DATABASE_EXTRA}`,
        collection: autoload.config._SESSION_COLLECTION
    }),
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}));

// parsing the incoming data
backEndRouter.use(express.json());
backEndRouter.use(express.urlencoded({extended: true}));

//Allow CORS
backEndRouter.use(cors())

// cookie parser middleware
backEndRouter.use(cookieParser());

/*log requests*/
backEndRouter.get('*', (req, res, next) => {
    autoload.logRequests(req, next);
});
backEndRouter.post('*', (req, res, next) => {
    autoload.logRequests(req, next);
});
backEndRouter.put('*', (req, res, next) => {
    autoload.logRequests(req, next);
});
backEndRouter.delete('*', (req, res, next) => {
    autoload.logRequests(req, next);
});

backEndRouter.patch('*', (req, res, next) => {
    autoload.logRequests(req, next);
});


backEndRouter.use('/js', express.static(global.rootDir + '/public/js'));
backEndRouter.use('/css', express.static(global.rootDir + '/public/css'));
backEndRouter.use('/data', express.static(global.rootDir + '/public/data'));
backEndRouter.use('/docs', express.static(global.rootDir + '/public/html'));
backEndRouter.use('/img', express.static(global.rootDir + '/public/media'));

/*
backEndRouter.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/html/home.html');
});
 */

//If a request starts with /database is sent to database driver!
backEndRouter.use('/auth', authDriver);
backEndRouter.use('/database', databaseDriver);
backEndRouter.use('/user', userDriver);
backEndRouter.use('/channel', channelDriver);
backEndRouter.use('/', viewDriver);

backEndRouter.listen(autoload.config._WEBSERVER_PORT, () => {
    console.log(`Server started on port ${autoload.config._WEBSERVER_PORT}`);
});