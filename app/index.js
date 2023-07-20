const express = require('express');
const app = express();
const port = 8000;

//testing per registrazione e login
const bcrypt = require('bcrypt')

//curl -X GET localhost:8000 && echo ""
app.get('/', (req, res) => {
    res.send('Hello World!');
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
    res.send('<h1>'+username+'</h1>');
});

//lista utenti temporanea
const usersList = [];

//creazione utente
app.post("/app/user", (req, res) => {

    try {
        let PasswdSalt = bcrypt.genSalt()  //per capire il meccanismo del salt rifarsi alle slide di Renzo
        let PasswdHased = bcrypt.hash(req.body.password, PasswdSalt);
        const NewUser = { username: req.body.username, 
                          password: PasswdHased };
        console.log(NewUser); 
        if(usersList.includes(NewUser.username)){ //username già esistente
            usersList.push(NewUser.username);
            res.status(201).send();
        }
        else
            res.status(400).send();

       
    } catch {
        res.status(422).send()
    }



});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

