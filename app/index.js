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

app.post('/test/', (req, res) => {
    res.send('<h1>Vamos a Faenza</h1>');
});

app.put('/test/', (req, res) => {
    res.send('<h1>Vamos a Castel maggiore</h1>');
});

app.delete('/test/', (req, res) => {
    res.send('<h1>Vamos a Campobasso</h1>');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

