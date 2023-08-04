const express = require('express');
//const config = require('./config/squealer');
const autoload = require('./autoload/autoload');
const backEndRouter = express();
const databaseDriver = require('./drivers/databaseDriver');
global.rootDir = __dirname;
global.startDate = null;
global.autoload = autoload;

backEndRouter.use('/js', express.static(global.rootDir + '/public/js'));
backEndRouter.use('/css', express.static(global.rootDir + '/public/css'));
backEndRouter.use('/data', express.static(global.rootDir + '/public/data'));
backEndRouter.use('/docs', express.static(global.rootDir + '/public/html'));
backEndRouter.use('/img', express.static(global.rootDir + '/public/media'));

//curl -X GET localhost:8000 && echo ""
backEndRouter.get('/', (req, res) => {
    //res.send('Hello World!');
    res.sendFile(__dirname + '/index.html');
});

backEndRouter.get("/app/user/:username", (req, res) => {
    let username = req.params['username'];
    console.log("Username :", username);
    res.send('<h1>' + username + '</h1>');
});

//testing per registrazione e login
const bcrypt = require('bcrypt')

//lista utenti temporanea
const usersList = [];

//creazione utente
backEndRouter.post("/app/user", (req, res) => {
    console.log("creazione user");
    /*res.send('password');
    try {
        let PasswdSalt = bcrypt.genSalt()  //per capire il meccanismo del salt rifarsi alle slide di Renzo
        let PasswdHased = bcrypt.hash(req.body.password, PasswdSalt);
        const NewUser = { username: req.body.username, 
                          password: PasswdHased };
        console.log(NewUser); 
        if(!usersList.includes(NewUser.username)){ //username già esistente
            usersList.push(NewUser.username);
            res.status(201).send();
        }
        else
            res.status(400).send();

       
    } catch {
        res.status(422).send()
    }*/
});

backEndRouter.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/html/home.html');
});

//FOR TESTS ONLY
//DO NOT CANCEL UNTIL THE PROJECT ISN'T FINISHED!!! THIS FUNCTION IS USEFUL TO TEST CONNECTIONS!!!

backEndRouter.get('/random/', async (req, res) => {
    //QUESTO DEVE STARE NEI MODEL!!!! NE CONTROLLER NE DRIVER!
    let conn = await autoload.mongoConnectionFunctions.getDatabaseConnection();
    await conn.connect();
    let database = await conn.db(autoload.config._DATABASE_NAME);
    //let filter = JSON.parse(`{"username": "romanellas"}`); //Filtro da stringa LE PROPRIETA' VOGLIONO GLI APICI DOPPI
    //let filterObj = {"username": "romanellas"};
    //let filter2 = {"first_name" : "Elisa"};
    let collection = await database.collection("users").find({}).toArray();
    res.send(collection);
});

//If a request starts with /database is sent to database driver!
backEndRouter.use('/database', databaseDriver);

backEndRouter.listen(autoload.config._WEBSERVER_PORT, () => {
    console.log(`Server started on port ${autoload.config._WEBSERVER_PORT}`);
});