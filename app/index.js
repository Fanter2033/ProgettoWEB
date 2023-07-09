const express = require('express')
const app = express()
const port = 80

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/test/', (req, res) => {
    res.send('<h1>Vamos a bailar</h1>')
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

