const express = require('express');
const app = express();
const port = 8000;

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

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

