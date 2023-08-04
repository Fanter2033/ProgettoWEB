const express = require("express");
const path = require("path");
const autoload = require("../autoload/autoload");
const databaseDriver = express();
//const DatabaseController = require("../controllers/DatabaseController");
//const DatabaseModel = require("../models/DatabaseModel");

//let controller = new DatabaseController(new DatabaseModel(autoload.mongoConnectionFunctions.getDatabaseConnection()));

databaseDriver.get('/', function (req, res) {
    res.sendFile(path.resolve(`../app/public/html/goAway.html`));
});

databaseDriver.get('/:collection/', async function (req, res) {
    let collectionName = req.params['collection'];
    if (collectionName === 'help') {
        //res.send(controller.getDatabaseCollections());
    } else {
        /*
        let conn = await autoload.mongoConnectionFunctions.getDatabaseConnection();
    await conn.connect();
    let database = await conn.db(autoload.config._DATABASE_NAME);
    let filter = JSON.parse(`{"username": "romanellas"}`); //Filtro da stringa LE PROPRIETA' VOGLIONO GLI APICI DOPPI
    let filterObj = {"username": "romanellas"};
    let collection = await database.collection(collectionName).find({}).toArray();
    res.send(collection);
         */
    }

});

module.exports = databaseDriver;
