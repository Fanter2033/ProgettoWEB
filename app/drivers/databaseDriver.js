const express = require("express");
const path = require("path");
const databaseDriver = express();
const DatabaseController = require("../controllers/DatabaseController");
const DatabaseModel = require("../models/DatabaseModel");

let controller = new DatabaseController(new DatabaseModel());

/**
 * method: GET
 * route: /
 */
databaseDriver.get('/', function (req, res) {
    res.sendFile(path.resolve(`../app/public/html/goAway.html`));
});

databaseDriver.get('/:collection/unique/:field/', async function(req, res) {
    let collectionName = req.params['collection'];
    let field = req.params['field'];
    let ctrl = await controller.makeUniqueIndex(collectionName, field);
    res.statusCode = ctrl.code;
    res.send(ctrl.msg);
});


databaseDriver.get('/:collection/', async function (req, res) {
    let collectionName = req.params['collection'];
    if (collectionName === 'help') {
        let ctrlOut = await controller.getDatabaseCollections();
        res.send(ctrlOut);
    } else {
        res.send(await controller.getCollectionContent(collectionName));
    }
});

module.exports = databaseDriver;
