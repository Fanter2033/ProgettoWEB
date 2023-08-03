const express = require('express');
//const config = require('./config/squealer');
const autoload = require('./autoload/autoload');
const app = express();
global.rootDir = __dirname;
global.startDate = null;

app.use('/js', express.static(global.rootDir + '/public/js'));
app.use('/css', express.static(global.rootDir + '/public/css'));
app.use('/data', express.static(global.rootDir + '/public/data'));
app.use('/docs', express.static(global.rootDir + '/public/html'));
app.use('/img', express.static(global.rootDir + '/public/media'));

//curl -X GET localhost:8000 && echo ""
app.get('/', (req, res) => {
    //res.send('Hello World!');
    res.sendFile(__dirname + '/index.html');
});

//curl -X GET localhost:8000/test/ && echo ""
app.get('/test/', (req, res) => {
    res.send('<h1>Vamos a bailar</h1>');
});

//curl -X POST localhost:8000/test/ && echo ""
app.post('/test/', (req, res) => {
    res.send('<h1>Vamos a Faenza</h1>');
});

//curl -X PUT localhost:8000/test/ && echo ""
app.put('/test/', (req, res) => {
    res.send('<h1>Vamos a Castel maggiore</h1>');
});

//curl -X DELETE localhost:8000/test/ && echo ""
app.delete('/test/', (req, res) => {
    res.send('<h1>Vamos a Campobasso</h1>');
});


app.get("/app/user/:username", (req, res) => {
    let username = req.params['username'];
    console.log("Username :", username);
    res.send('<h1>' + username + '</h1>');
});

//testing per registrazione e login
const bcrypt = require('bcrypt')

//lista utenti temporanea
const usersList = [];

//creazione utente
app.post("/app/user", (req, res) => {
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

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/html/home.html');
});

//FOR TESTS ONLY
//DO NOT CANCEL UNTIL THE PROJECT ISN'T FINISHED!!! THIS FUNCTION IS USEFUL TO TEST CONNECTIONS!!!
/*
app.get('/autoload/', async (req, res) => {
    let conn = await autoload.mongoConnectionFunctions.getDatabaseConnection();
    await conn.connect();
    let database = await conn.db(autoload.config._DATABASE_NAME);
    let collection = await database.collection("users").find({username: "romanellas"}).toArray();
    res.send(collection);
});
 */

app.listen(autoload.config._WEBSERVER_PORT, () => {
    console.log(`Server started on port ${autoload.config._WEBSERVER_PORT}`);
})


