const express = require("express");
const autoload = require("./autoload/autoload");
const backEndRouter = express();

const databaseDriver = require("./drivers/databaseDriver");
const authDriver = require("./drivers/authDriver.js");
const userDriver = require("./drivers/userDriver");
const channelDriver = require("./drivers/channelDriver");
const viewDriver = require("./drivers/views/viewDriver");
const squealDriver = require('./drivers/squealDriver');
const utilsDriver = require('./drivers/utilsDriver');

const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cronDaemon = require("node-cron");

const QuoteController = require("./controllers/QuoteController");
const QuoteModel = require("./models/QuoteModel");
let controller = new QuoteController(new QuoteModel());

const UserController = require("./controllers/UserController");
const UserModel = require("./models/UserModel");
let userTestQuote = new UserController(new UserModel());

const SquealController = require("./controllers/SquealController");
const SquealModel = require("./models/SquealModel");
let squealCtrl = new SquealController(new SquealModel());

const ChannelController = require("./controllers/ChannelController");
const ChannelModel = require("./models/ChannelModel");
const UserDto = require("./entities/dtos/UserDto");
const SquealDto = require("./entities/dtos/SquealDto");
let channelCtrl = new ChannelController(new ChannelModel());

cronDaemon.schedule("0 0 * * *", async function () {
    //It's midnight!
    try {
        let userList = await userTestQuote.getUserList({}, 0, -1, "", "", "");
        await controller.resetQuote(userList.content.users);
    } catch (error) {
        console.error("Errore duranate l'aggiornamento quote");
    }
});

cronDaemon.schedule("* * * * * *", async function () {
    //Every second
    await squealCtrl.updateAutoMessages();
});

cronDaemon.schedule("0 12 * * *", async function () {
    //Everyday at 12:00
    ///Create userDTO
    let userObj = new UserDto();
    userObj.username = 'squealerd';
    userObj.email = 'squealerd@squealer.it';
    userObj.first_name = 'Squealer';
    userObj.last_name = 'Daemon';
    userObj.registration_timestamp = squealCtrl.getCurrentTimestampSeconds();
    userObj.psw_shadow = await squealCtrl.crypt('ciaociao');
    userObj.isAdmin = true;
    userObj.isUser = false;
    userObj.vip = false;
    userObj.isSmm = false;
    userObj.locked = false;
    userObj.verbalized_popularity = 0;
    userObj.verbalized_unpopularity = 0;
    userObj.pfp = '';

    const today = new Date();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let year = today.getFullYear();

    //NASA API

    let nasaApiSqueal = new SquealDto();
    nasaApiSqueal.message_type = 'MESSAGE_TEXT';
    nasaApiSqueal.date = squealCtrl.getCurrentTimestampSeconds();
    nasaApiSqueal.destinations = ["§NASA_OFFICIAL"];

    fetch(`https://api.nasa.gov/planetary/apod?api_key=UFkR4tAXDin0uS4RP7HrKHyWrnio1rvi13v4c3b8&date=${year}-${month}-${day}`).then((r) => {
        return (r.json());
    }).then((json) => {
        nasaApiSqueal.content = `EHI! IL NUOVO SQUEAL GIOENALIERO DELLA NASA E' QUI! : <a href="${json.url}" target="_blank">Apri il link!</a>`;
        squealCtrl.postSqueal(nasaApiSqueal, userObj.getDocument(), null, true);
    })

    //Numbers API
    let numbersApiSqueal = new SquealDto();
    numbersApiSqueal.message_type = 'MESSAGE_TEXT';
    numbersApiSqueal.date = squealCtrl.getCurrentTimestampSeconds();
    numbersApiSqueal.destinations = ["§NUMBER_API_OFFICIAL"];

    //numbers api
    fetch(`http://numbersapi.com/${month}/${day}/date?json`).then((r) => {
        return (r.json());
    }).then((json) => {
        numbersApiSqueal.content = json.text;
        squealCtrl.postSqueal(numbersApiSqueal, userObj.getDocument(), null, true);
    })



});


global.rootDir = __dirname;
global.startDate = null;
global.autoload = autoload;

const oneDay = 1000 * 60 * 60 * 24;

/*
 * save and crypt sessions
 */
backEndRouter.use(
    session({
        secret: autoload.config._SESSION_SECRET,
        store: MongoStore.create({
            mongoUrl: `mongodb://${autoload.config._DATABASE_USER}:${autoload.config._DATABASE_PWD}@${autoload.config._DATABASE_HOST}:${autoload.config._DATABASE_PORT}/${autoload.config._DATABASE_NAME}${autoload.config._DATABASE_EXTRA}`,
            collection: autoload.config._SESSION_COLLECTION,
        }),
        saveUninitialized: true,
        cookie: {maxAge: oneDay},
        resave: false,
    })
);

/*   Express middleware
*   saves and crypts sessions
*/
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
backEndRouter.use(cors({
    /*origin: "http://localhost:8000"*/
    origin: ['http://localhost:5173', 'http://localhost:8000', 'http://localhost:3000'],
    credentials: true
}));

// cookie parser middleware
backEndRouter.use(cookieParser());

/*log requests*/
backEndRouter.get("*", (req, res, next) => {
    autoload.logRequests(req, next);
});
backEndRouter.post("*", (req , res, next) => {
    autoload.logRequests(req, next);
});
backEndRouter.put("*", (req, res, next) => {
    autoload.logRequests(req, next);
});
backEndRouter.delete("*", (req, res, next) => {
    autoload.logRequests(req, next);
});

backEndRouter.patch("*", (req, res, next) => {
    autoload.logRequests(req, next);
});

backEndRouter.use("/js", express.static(global.rootDir + "/public/js"));
backEndRouter.use("/css", express.static(global.rootDir + "/public/css"));
backEndRouter.use("/data", express.static(global.rootDir + "/public/data"));
backEndRouter.use("/docs", express.static(global.rootDir + "/public/html"));
backEndRouter.use("/img", express.static(global.rootDir + "/public/media"));

/*
backEndRouter.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/html/home.html');
});
 */

//If a request starts with /database is sent to database driver!
backEndRouter.use("/auth", authDriver);
backEndRouter.use("/database", databaseDriver);
backEndRouter.use("/user", userDriver);
backEndRouter.use("/channel", channelDriver);
backEndRouter.use("/squeal", squealDriver);
backEndRouter.use("/utils", utilsDriver);
backEndRouter.use("/", viewDriver);

//Dobbiamo creare l'utente squealerd che è amministratore e crea squeal
userTestQuote.createSquealerD().then(() => {
    //Ora che esiste l'utente scheduliamo le operazioni per inviare i messaggi automatici
    channelCtrl.createSquealerChannels();
});

backEndRouter.listen(autoload.config._WEBSERVER_PORT, () => {
    console.log(`Server started on port ${autoload.config._WEBSERVER_PORT}`);
});

//Cron handler: (sec) min  h  d_m  m  d_w
//ogni 10 sec: */10 * * * * *
//ogni minuto: * * * * *
//tutti i giorni a mezzanotte: 0 0 * * *
//tutti i lunedì: 0 0 * * 1
//il primo di ogni mese: 0 0 1 * *
